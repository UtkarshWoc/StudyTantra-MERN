import React, { useEffect, useRef } from 'react';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

let scriptPromise;
const loadGoogleScript = () => {
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return scriptPromise;
};

/**
 * "Sign in with Google" via Google Identity Services. Renders nothing unless
 * VITE_GOOGLE_CLIENT_ID is configured. onCredential receives the ID token.
 */
const GoogleSignInButton = ({ onCredential, text = 'signin_with' }) => {
  const containerRef = useRef(null);
  const callbackRef = useRef(onCredential);
  useEffect(() => { callbackRef.current = onCredential; }, [onCredential]);

  useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        if (cancelled || !window.google?.accounts?.id || !containerRef.current) return;
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (response) => callbackRef.current(response.credential),
        });
        window.google.accounts.id.renderButton(containerRef.current, {
          theme: 'filled_black',
          size: 'large',
          shape: 'pill',
          text,
          width: 320,
        });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [text]);

  if (!CLIENT_ID) return null;

  return (
    <>
      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-[#334155]/60" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">or</span>
        <div className="h-px flex-1 bg-[#334155]/60" />
      </div>
      <div ref={containerRef} className="flex justify-center min-h-[44px]" />
    </>
  );
};

export default GoogleSignInButton;
