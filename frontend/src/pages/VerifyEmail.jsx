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
  const [state, setState] = useState(
    token ? { status: 'loading' } : { status: 'error', message: 'This verification link is missing its token.' }
  );
  const requested = useRef(false);

  useEffect(() => {
    if (!token || requested.current) return;
    requested.current = true;
    api
      .post('/auth/verify-email', { token })
      .then(({ data }) => {
        setState({ status: 'done' });
        if (user && String(user._id) === String(data.user._id)) setUser(data.user);
      })
      .catch((error) => setState({ status: 'error', message: getErrorMessage(error) }));
  }, [token, user, setUser]);

  return (
    <AuthCard title="Email Verification">
      <div className="text-center text-on-surface-variant space-y-4 py-2">
        {state.status === 'loading' && (
          <>
            <Loader2 className="mx-auto animate-spin text-primary" size={40} />
            <p className="text-xs">Verifying institutional email...</p>
          </>
        )}
        {state.status === 'done' && (
          <>
            <CheckCircle2 className="mx-auto text-emerald-600" size={40} />
            <p className="text-xs font-semibold text-on-surface">Your academic email has been verified.</p>
          </>
        )}
        {state.status === 'error' && (
          <>
            <XCircle className="mx-auto text-error" size={40} />
            <p className="text-xs text-error font-medium">{state.message}</p>
          </>
        )}
        {state.status !== 'loading' && (
          <Link to={user ? '/dashboard' : '/login'} className={authButtonClass}>
            {user ? 'Enter Learning Vault' : 'Sign In'}
          </Link>
        )}
      </div>
    </AuthCard>
  );
};

export default VerifyEmail;
