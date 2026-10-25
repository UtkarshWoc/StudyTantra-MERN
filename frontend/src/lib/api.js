import axios from 'axios';

const rawApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').trim().replace(/\/+$/, '');
export const API_BASE = `${rawApiUrl}/api`;

// The access token lives only in memory (never localStorage) so XSS can't
// exfiltrate a long-lived credential. The refresh token is an httpOnly cookie.
let accessToken = null;
let onSessionExpired = () => {};

export const setAccessToken = (token) => { accessToken = token; };
export const getAccessToken = () => accessToken;
export const setSessionExpiredHandler = (fn) => { onSessionExpired = fn; };

export const api = axios.create({ baseURL: API_BASE, withCredentials: true });

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let refreshPromise = null;

/**
 * Exchange the refresh cookie for a new access token. Concurrent callers share
 * one request so a burst of 401s triggers a single refresh.
 */
export const refreshSession = () => {
  refreshPromise ??= axios
    .post(`${API_BASE}/auth/refresh`, null, { withCredentials: true })
    .then(({ data }) => {
      accessToken = data.accessToken;
      return data;
    })
    .finally(() => { refreshPromise = null; });
  return refreshPromise;
};

// Credential endpoints report their own 401s (e.g. wrong password) to the form.
const NO_REFRESH = /\/auth\/(login|register|refresh|logout|google|forgot-password|reset-password|verify-email)$/;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    if (response?.status === 401 && config && !config._retried && !NO_REFRESH.test(config.url || '')) {
      config._retried = true;
      try {
        await refreshSession();
        return api(config);
      } catch {
        accessToken = null;
        onSessionExpired();
      }
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  const data = error?.response?.data;
  if (data?.message) return data.message;
  if (typeof data === 'string' && data.length < 300) {
    try {
      const parsed = JSON.parse(data);
      if (parsed.message) return parsed.message;
    } catch {
      return data;
    }
  }
  return error?.message || fallback;
};

/**
 * fetch() with the same auth + refresh behaviour, for streaming responses
 * (axios can't stream in the browser).
 */
export const authFetch = async (path, init = {}) => {
  const doFetch = () => fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: { ...(init.headers || {}), ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
  });
  let res = await doFetch();
  if (res.status === 401) {
    try {
      await refreshSession();
      res = await doFetch();
    } catch {
      accessToken = null;
      onSessionExpired();
    }
  }
  return res;
};
