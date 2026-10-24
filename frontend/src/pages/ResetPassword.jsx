import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, Loader2, CheckCircle2 } from 'lucide-react';
import AuthCard, { authInputClass, authButtonClass } from '../components/AuthCard';
import { api, getErrorMessage } from '../lib/api';
import { useAuth } from '../context/auth';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const { user, logout } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState({ loading: false, done: false, error: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) return setStatus({ loading: false, done: false, error: 'Password must be at least 8 characters.' });
    if (password !== confirm) return setStatus({ loading: false, done: false, error: 'Passwords do not match.' });

    setStatus({ loading: true, done: false, error: '' });
    try {
      await api.post('/auth/reset-password', { token, password });
      // Every session was revoked server-side; clear this tab's state too.
      if (user) await logout();
      setStatus({ loading: false, done: true, error: '' });
    } catch (error) {
      setStatus({ loading: false, done: false, error: getErrorMessage(error) });
    }
  };

  if (!token) {
    return (
      <AuthCard title="Invalid link" subtitle="This password reset link is missing its token.">
        <Link to="/forgot-password" className={authButtonClass}>Request a new link</Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Choose a new password" subtitle="You'll be signed out of all devices.">
      {status.done ? (
        <div className="text-center text-slate-300 space-y-4">
          <CheckCircle2 className="mx-auto text-emerald-400" size={40} />
          <p className="text-sm">Your password has been updated.</p>
          <Link to="/login" className={authButtonClass}>Sign in</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status.error && (
            <div className="p-3 rounded-xl text-sm font-semibold bg-red-950/30 text-red-300 border border-red-800/40">
              {status.error} {/expired|invalid/i.test(status.error) && <Link to="/forgot-password" className="underline">Request a new link</Link>}
            </div>
          )}
          {[
            { id: 'password', label: 'New password', value: password, onChange: setPassword, placeholder: 'Min. 8 characters' },
            { id: 'confirm', label: 'Confirm password', value: confirm, onChange: setConfirm, placeholder: 'Re-enter password' },
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">{field.label}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input id={field.id} type="password" autoComplete="new-password" value={field.value} onChange={(e) => field.onChange(e.target.value)} className={authInputClass} placeholder={field.placeholder} />
              </div>
            </div>
          ))}
          <button type="submit" disabled={status.loading} className={authButtonClass}>
            {status.loading ? <><Loader2 className="animate-spin w-4 h-4" /> Saving...</> : 'Update password'}
          </button>
        </form>
      )}
    </AuthCard>
  );
};

export default ResetPassword;
