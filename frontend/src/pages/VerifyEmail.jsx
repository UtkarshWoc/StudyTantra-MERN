import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import AuthCard, { authButtonClass } from '../components/AuthCard';
import { api, getErrorMessage } from '../lib/api';
import { useAuth } from '../context/auth';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const { user, setUser } = useAuth();
  const [state, setState] = useState(token ? { status: 'loading' } : { status: 'error', message: 'This verification link is missing its token.' });
  const requested = useRef(false);

  useEffect(() => {
    // StrictMode runs effects twice in dev; the token is single-use.
    if (!token || requested.current) return;
    requested.current = true;
    api.post('/auth/verify-email', { token })
      .then(({ data }) => {
        setState({ status: 'done' });
        // Signed in on this device: reflect the new email/verified status immediately
        if (user && String(user._id) === String(data.user._id)) setUser(data.user);
      })
      .catch((error) => setState({ status: 'error', message: getErrorMessage(error) }));
  }, [token, user, setUser]);

  return (
    <AuthCard title="Email verification">
      <div className="text-center text-slate-300 space-y-4">
        {state.status === 'loading' && (<><Loader2 className="mx-auto animate-spin text-amber-400" size={40} /><p className="text-sm">Verifying your email...</p></>)}
        {state.status === 'done' && (<><CheckCircle2 className="mx-auto text-emerald-400" size={40} /><p className="text-sm">Your email is verified.</p></>)}
        {state.status === 'error' && (<><XCircle className="mx-auto text-red-400" size={40} /><p className="text-sm">{state.message}</p></>)}
        {state.status !== 'loading' && (
          <Link to={user ? '/dashboard' : '/login'} className={authButtonClass}>{user ? 'Go to dashboard' : 'Sign in'}</Link>
        )}
      </div>
    </AuthCard>
  );
};

export default VerifyEmail;
