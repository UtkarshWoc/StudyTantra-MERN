import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AuthContext } from './auth';
import { api, refreshSession, setAccessToken, setSessionExpiredHandler, getErrorMessage } from '../lib/api';

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  // When a refresh fails mid-session, drop to signed-out; ProtectedRoute redirects to /login.
  useEffect(() => {
    setSessionExpiredHandler(clearSession);
  }, [clearSession]);

  // Restore the session from the httpOnly refresh cookie on load.
  useEffect(() => {
    localStorage.removeItem('userInfo'); // tokens used to be stored here; never again
    refreshSession()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const startSession = useCallback((data) => {
    setAccessToken(data.accessToken);
    setUser(data.user);
    return { success: true, data };
  }, []);

  const authCall = useCallback(async (request, fallback) => {
    try {
      const { data } = await request();
      return startSession(data);
    } catch (error) {
      return { success: false, error: getErrorMessage(error, fallback) };
    }
  }, [startSession]);

  const login = useCallback((email, password) =>
    authCall(() => api.post('/auth/login', { email, password }), 'Invalid email or password.'), [authCall]);

  const register = useCallback((name, email, password) =>
    authCall(() => api.post('/auth/register', { name, email, password }), 'Registration failed.'), [authCall]);

  const loginWithGoogle = useCallback((credential) =>
    authCall(() => api.post('/auth/google', { credential }), 'Google sign-in failed.'), [authCall]);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Signing out locally still matters even if the server call fails
    }
    clearSession();
  }, [clearSession]);

  const refreshUser = useCallback(async () => {
    const { data } = await api.get('/auth/me');
    setUser(data.user);
    return data.user;
  }, []);

  const updateProfile = useCallback(async (name, email, currentPassword) => {
    try {
      const { data } = await api.put('/auth/profile', { name, email, currentPassword });
      setUser(data.user);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      const { data } = await api.put('/auth/password', { currentPassword, newPassword });
      // Other sessions were revoked and old tokens invalidated; keep this one alive.
      setAccessToken(data.accessToken);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error, 'Could not update password.') };
    }
  }, []);

  const deleteAccount = useCallback(async (password, confirm) => {
    try {
      await api.delete('/auth/account', { data: { password, confirm } });
      clearSession();
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error, 'Could not delete account.') };
    }
  }, [clearSession]);

  const value = useMemo(() => ({
    user, setUser, login, register, loginWithGoogle, logout, refreshUser, updateProfile, changePassword, deleteAccount,
  }), [user, login, register, loginWithGoogle, logout, refreshUser, updateProfile, changePassword, deleteAccount]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1120]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
