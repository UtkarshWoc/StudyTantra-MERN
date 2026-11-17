import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { authInputClass, authButtonClass } from '../components/AuthCard';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) navigate('/dashboard');
      else setError(result.error || 'Authentication failed. Please verify credentials.');
    } catch {
      setError('Unexpected error during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async (credential) => {
    setError('');
    setIsLoading(true);
    const result = await loginWithGoogle(credential);
    setIsLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Top Navbar */}
      <header className="w-full border-b border-outline-variant/30 bg-surface/85 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group" aria-label="StudyTantra Home">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-xl">local_fire_department</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-2xl font-bold tracking-tight text-on-surface leading-none">
                StudyTantra
              </span>
              <span className="text-[10px] font-label font-bold uppercase tracking-wider text-primary bg-primary-fixed px-1.5 py-0.5 rounded">
                Sahara
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-xs text-on-surface-variant font-label hidden sm:inline">
              Don't have an account?
            </span>
            <Link
              to="/register"
              className="px-4 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold font-label transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Split Section */}
      <main className="relative flex-1 w-full flex items-center justify-center py-10 lg:py-16 overflow-hidden">
        {/* Subtle Ambient Glow Orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary-fixed/40 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Pane: Brand & Academic Showcase (7 cols) */}
            <section className="lg:col-span-7 flex flex-col pt-2 lg:pr-6">
              {/* Monospaced Section Marker & Category */}
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-label text-xs font-semibold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Cognitive OS v4.5
                </span>
                <span className="text-xs font-label text-outline uppercase tracking-widest font-medium">
                  01 // Academic Portal
                </span>
              </div>

              {/* Hero Editorial Headline */}
              <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl text-on-surface font-semibold tracking-tight leading-[1.08] mb-6">
                Retain More. <br className="hidden sm:inline" />
                <span className="italic font-normal text-primary">Cram Less.</span> Master <br className="hidden sm:inline" />
                University Finals.
              </h1>

              {/* Compelling Narrative Subtitle */}
              <p className="text-base sm:text-lg text-on-surface-variant font-body leading-relaxed max-w-2xl mb-10">
                Turn dense syllabi, research papers, and lecture slides into high-retention active recall vaults with algorithmic FSRS spacing tuned for cognitive resilience.
              </p>

              {/* Asymmetric Visual Showcase Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {/* Value Card 1 */}
                <div className="group relative bg-surface-container-lowest rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between border border-outline-variant/30">
                  <div className="mb-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-3 group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-2xl">auto_stories</span>
                    </div>
                    <span className="text-[10px] font-label font-bold tracking-widest uppercase text-tertiary">
                      Ingest Module
                    </span>
                    <h3 className="font-headline text-base text-on-surface font-semibold leading-snug mt-1 mb-1">
                      Smart PDF Ingestion
                    </h3>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      Transform lecture slides into structured recall decks instantly.
                    </p>
                  </div>
                  <div className="pt-2.5 border-t border-outline-variant/30 flex items-center justify-between text-[10px] font-label text-primary font-semibold">
                    <span>PDF • PPTX • Notes</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </div>
                </div>

                {/* Value Card 2 */}
                <div className="group relative bg-surface-container rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between border border-outline-variant/30">
                  <div className="mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
                      <span className="material-symbols-outlined text-2xl">query_stats</span>
                    </div>
                    <span className="text-[10px] font-label font-bold tracking-widest uppercase text-primary">
                      Algorithmic Engine
                    </span>
                    <h3 className="font-headline text-base text-on-surface font-semibold leading-snug mt-1 mb-1">
                      FSRS-4.5 Recall
                    </h3>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      Mathematical memory stabilization calibrated against forgetting curves.
                    </p>
                  </div>
                  <div className="pt-2">
                    <svg className="w-full h-6 text-primary overflow-visible" fill="none" viewBox="0 0 160 28">
                      <path d="M0 4 C 30 5, 50 14, 80 16 C 110 18, 130 24, 160 26" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                      <circle cx="80" cy="16" r="3" className="fill-primary" />
                      <circle cx="160" cy="26" r="3" className="fill-primary" />
                    </svg>
                  </div>
                </div>

                {/* Value Card 3 */}
                <div className="group relative bg-surface-container-lowest rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between border border-outline-variant/30">
                  <div className="mb-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-3 group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-2xl">verified</span>
                    </div>
                    <span className="text-[10px] font-label font-bold tracking-widest uppercase text-tertiary">
                      Grounded Citations
                    </span>
                    <h3 className="font-headline text-base text-on-surface font-semibold leading-snug mt-1 mb-1">
                      Source Jump
                    </h3>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      Every card and quiz item links directly to page proofs and theorems.
                    </p>
                  </div>
                  <div className="pt-2.5 border-t border-outline-variant/30 flex items-center justify-between text-[10px] font-label text-on-surface-variant">
                    <span className="font-mono text-[9px] bg-surface-container px-1.5 py-0.5 rounded">p. 342 § 4.2</span>
                    <span className="text-tertiary font-semibold">100% Proven</span>
                  </div>
                </div>
              </div>

              {/* Editorial Quote */}
              <div className="flex items-center gap-3 text-xs text-secondary font-label">
                <span className="text-primary font-headline text-2xl font-bold">“</span>
                <span className="italic max-w-lg">
                  “StudyTantra replaced four fragmented apps. The FSRS decay curves are eerily accurate for university exams.”
                </span>
              </div>
            </section>

            {/* Right Pane: Authentication Card (5 cols) */}
            <section className="lg:col-span-5 w-full">
              <div className="relative bg-surface-container-lowest rounded-2xl p-7 sm:p-10 shadow-lg shadow-on-surface/5 border border-outline-variant/30 animate-slide-up">
                {/* Soft Accent Trim Top Line */}
                <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-60" />

                {/* Header Titles */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-label font-bold tracking-widest uppercase text-primary">
                      <span className="material-symbols-outlined text-sm">lock_open</span> Secure Entry
                    </span>
                    <span className="text-[10px] font-label text-outline">256-bit AES</span>
                  </div>
                  <h2 className="font-headline text-3xl font-semibold text-on-surface tracking-tight leading-tight">
                    Access Your Study Vault
                  </h2>
                  <p className="text-xs text-on-surface-variant font-body mt-1 leading-relaxed">
                    Sign in with your academic credentials to sync your active spaced review queues.
                  </p>
                </div>

                {/* Google Sign-in */}
                <div className="mb-5">
                  <GoogleSignInButton onCredential={handleGoogle} />
                </div>

                <div className="relative flex items-center justify-center mb-5">
                  <div className="border-t border-outline-variant/40 w-full" />
                  <span className="bg-surface-container-lowest px-3 text-[10px] font-label uppercase tracking-widest text-outline shrink-0">
                    Or with email
                  </span>
                </div>

                {error && (
                  <div className="mb-5 p-3 rounded-xl text-xs font-semibold bg-error-container text-on-error-container border border-error/20 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-error shrink-0">error</span>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-[11px] font-label font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                      Academic Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={authInputClass}
                        placeholder="arya.sharma@university.edu"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="password" className="block text-[11px] font-label font-bold uppercase tracking-wider text-on-surface-variant">
                        Password
                      </label>
                      <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${authInputClass} pr-12`}
                        placeholder="••••••••••••"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={isLoading} className={authButtonClass}>
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Learning Vault</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-xs text-on-surface-variant font-label mt-6">
                  New to StudyTantra?{' '}
                  <Link to="/register" className="font-semibold text-primary hover:underline">
                    Create your free scholar account
                  </Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
