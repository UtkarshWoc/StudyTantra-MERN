import React, { useState } from 'react';
import { MailWarning, X } from 'lucide-react';
import { useAuth } from '../context/auth';
import { api, getErrorMessage } from '../lib/api';

// Nudges unverified users; verification is required for password recovery to be trustworthy.
const VerifyEmailBanner = () => {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [status, setStatus] = useState('');

  if (!user || user.emailVerified || dismissed) return null;

  const resend = async () => {
    setStatus('sending');
    try {
      await api.post('/auth/resend-verification');
      setStatus('sent');
    } catch (error) {
      setStatus(getErrorMessage(error));
    }
  };

  return (
    <div role="status" className="flex items-center gap-3 px-6 py-2.5 bg-amber-500/10 border-b border-amber-500/20 text-amber-200 text-sm">
      <MailWarning size={16} className="shrink-0" />
      <span className="flex-1">
        Please verify <span className="font-semibold">{user.email}</span> — check your inbox for the link.{' '}
        {status === 'sent' ? <span className="text-emerald-300">Sent!</span> : (
          <button onClick={resend} disabled={status === 'sending'} className="underline font-semibold cursor-pointer disabled:opacity-50">Resend</button>
        )}
        {status && !['sent', 'sending'].includes(status) && <span className="text-red-300 ml-2">{status}</span>}
      </span>
      <button onClick={() => setDismissed(true)} aria-label="Dismiss" className="p-1 rounded hover:bg-white/10 cursor-pointer"><X size={14} /></button>
    </div>
  );
};

export default VerifyEmailBanner;
