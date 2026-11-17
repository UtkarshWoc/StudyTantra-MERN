import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import AuthCard, { authInputClass, authButtonClass } from '../components/AuthCard';
import { api, getErrorMessage } from '../lib/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, sent: false, error: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setStatus({ loading: false, sent: false, error: 'Enter your email address.' });
    setStatus({ loading: true, sent: false, error: '' });
    try {
      await api.post('/auth/forgot-password', { email });
      setStatus({ loading: false, sent: true, error: '' });
    } catch (error) {
      setStatus({ loading: false, sent: false, error: getErrorMessage(error) });
    }
  };

  return (
    <AuthCard
      title="Reset Your Password"
      subtitle="We'll send a password reset link to your email address."
      footer={
        <Link to="/login" className="font-semibold text-primary hover:underline font-label text-xs">
          ← Return to Sign In
        </Link>
      }
    >
      {status.sent ? (
        <div className="text-center text-on-surface-variant space-y-3 py-2">
          <CheckCircle2 className="mx-auto text-emerald-600" size={40} />
          <p className="text-xs leading-relaxed">
            If an account exists for <span className="font-semibold text-on-surface">{email}</span>, a secure password recovery link has been dispatched. Link valid for 1 hour.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status.error && (
            <div className="p-3 rounded-xl text-xs font-semibold bg-error-container text-on-error-container border border-error/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-error shrink-0">error</span>
              <span>{status.error}</span>
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-[11px] font-label font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={authInputClass}
                placeholder="name@example.com"
              />
            </div>
          </div>
          <button type="submit" disabled={status.loading} className={authButtonClass}>
            {status.loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                <span>Sending Recovery Link...</span>
              </>
            ) : (
              'Send Recovery Link'
            )}
          </button>
        </form>
      )}
    </AuthCard>
  );
};

export default ForgotPassword;
