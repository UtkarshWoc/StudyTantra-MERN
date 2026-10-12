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
      title="Reset your password"
      subtitle="We'll email you a link to choose a new password."
      footer={<Link to="/login" className="font-bold text-amber-400 hover:text-amber-300">Back to sign in</Link>}
    >
      {status.sent ? (
        <div className="text-center text-slate-300 space-y-3">
          <CheckCircle2 className="mx-auto text-emerald-400" size={40} />
          <p className="text-sm">If an account exists for <span className="font-semibold text-slate-100">{email}</span>, a reset link is on its way. It expires in 1 hour.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status.error && <div className="p-3 rounded-xl text-sm font-semibold bg-red-950/30 text-red-300 border border-red-800/40">{status.error}</div>}
          <div>
            <label htmlFor="email" className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={authInputClass} placeholder="you@example.com" />
            </div>
          </div>
          <button type="submit" disabled={status.loading} className={authButtonClass}>
            {status.loading ? <><Loader2 className="animate-spin w-4 h-4" /> Sending...</> : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthCard>
  );
};

export default ForgotPassword;
