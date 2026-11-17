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
      if (user) await logout();
      setStatus({ loading: false, done: true, error: '' });
    } catch (error) {
      setStatus({ loading: false, done: false, error: getErrorMessage(error) });
    }
  };

  if (!token) {
    return (
      <AuthCard title="Invalid Link" subtitle="This password reset link is missing its authentication token.">
        <Link to="/forgot-password" className={authButtonClass}>
          Request a New Link
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Choose a New Password" subtitle="Your credentials will be updated across all active devices.">
      {status.done ? (
        <div className="text-center text-on-surface-variant space-y-4 py-2">
          <CheckCircle2 className="mx-auto text-emerald-600" size={40} />
          <p className="text-xs leading-relaxed">Your password has been successfully secured and updated.</p>
          <Link to="/login" className={authButtonClass}>
            Sign In with New Password
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status.error && (
            <div className="p-3 rounded-xl text-xs font-semibold bg-error-container text-on-error-container border border-error/20">
              {status.error}{' '}
              {/expired|invalid/i.test(status.error) && (
                <Link to="/forgot-password" className="underline font-bold">
                  Request a new link
                </Link>
              )}
            </div>
          )}
          {[
            { id: 'password', label: 'New Password', value: password, onChange: setPassword, placeholder: 'Min. 8 characters' },
            { id: 'confirm', label: 'Confirm New Password', value: confirm, onChange: setConfirm, placeholder: 'Re-enter password' },
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-[11px] font-label font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                {field.label}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  id={field.id}
                  type="password"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className={authInputClass}
                  placeholder={field.placeholder}
                />
              </div>
            </div>
          ))}
          <button type="submit" disabled={status.loading} className={authButtonClass}>
            {status.loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                <span>Updating Password...</span>
              </>
            ) : (
              'Set New Password'
            )}
          </button>
        </form>
      )}
    </AuthCard>
  );
};

export default ResetPassword;
