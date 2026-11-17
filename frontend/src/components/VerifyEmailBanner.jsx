import React, { useState } from 'react';
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
    <div
      role="status"
      className="flex items-center gap-3 px-6 py-2.5 bg-primary-fixed text-on-primary-fixed-variant border-b border-primary/20 text-xs font-label font-medium"
    >
      <span className="material-symbols-outlined text-[18px] text-primary shrink-0">
        mark_email_unread
      </span>
      <span className="flex-1">
        Please verify <span className="font-semibold text-on-surface">{user.email}</span> — check your inbox for the verification link.{' '}
        {status === 'sent' ? (
          <span className="text-emerald-700 font-bold ml-1">Sent!</span>
        ) : (
          <button
            onClick={resend}
            disabled={status === 'sending'}
            className="underline font-bold text-primary hover:text-primary/80 cursor-pointer disabled:opacity-50 ml-1"
          >
            Resend
          </button>
        )}
        {status && !['sent', 'sending'].includes(status) && (
          <span className="text-error font-semibold ml-2">{status}</span>
        )}
      </span>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-on-surface-variant transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
};

export default VerifyEmailBanner;
