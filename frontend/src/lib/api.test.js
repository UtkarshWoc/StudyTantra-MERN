import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { api, setAccessToken, getAccessToken, setSessionExpiredHandler } from './api';

// Fake transport for the `api` instance: a token is "valid" only if it is the current one.
const installAdapter = (validToken) => {
  const calls = [];
  api.defaults.adapter = async (config) => {
    calls.push(config.headers.Authorization);
    if (config.headers.Authorization === `Bearer ${validToken()}`) {
      return { data: { ok: true }, status: 200, statusText: 'OK', headers: {}, config };
    }
    const error = new Error('Unauthorized');
    error.config = config;
    error.response = { status: 401, data: { message: 'expired' }, config };
    throw error;
  };
  return calls;
};

describe('api client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    setAccessToken('old-token');
  });

  it('refreshes once on 401 and retries with the new token', async () => {
    let current = 'new-token';
    const calls = installAdapter(() => current);
    const post = vi.spyOn(axios, 'post').mockResolvedValue({ data: { accessToken: 'new-token', user: {} } });

    const res = await api.get('/documents');

    expect(res.data.ok).toBe(true);
    expect(post).toHaveBeenCalledTimes(1);
    expect(calls).toEqual(['Bearer old-token', 'Bearer new-token']);
    expect(getAccessToken()).toBe('new-token');
    current = null;
  });

  it('shares a single refresh between concurrent 401s', async () => {
    installAdapter(() => 'fresh');
    const post = vi.spyOn(axios, 'post').mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: { accessToken: 'fresh', user: {} } }), 10))
    );

    await Promise.all([api.get('/a'), api.get('/b'), api.get('/c')]);
    expect(post).toHaveBeenCalledTimes(1);
  });

  it('signals session expiry when the refresh fails', async () => {
    installAdapter(() => 'never');
    vi.spyOn(axios, 'post').mockRejectedValue(new Error('refresh failed'));
    const expired = vi.fn();
    setSessionExpiredHandler(expired);

    await expect(api.get('/documents')).rejects.toBeTruthy();
    expect(expired).toHaveBeenCalledTimes(1);
    expect(getAccessToken()).toBeNull();
  });

  it('does not try to refresh after a failed login', async () => {
    installAdapter(() => 'never');
    const post = vi.spyOn(axios, 'post');

    await expect(api.post('/auth/login', {})).rejects.toBeTruthy();
    expect(post).not.toHaveBeenCalled();
  });
});
