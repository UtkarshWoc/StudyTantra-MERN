import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { authInputClass, authButtonClass } from '../components/AuthCard';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await register(name, email, password);
      if (result.success) navigate('/dashboard');
      else setError(result.error || 'Registration failed.');
    } catch {
      setError('Unexpected error during registration.');
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
              Already have an account?
            </span>
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold font-label transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Split Section */}
      <main className="relative flex-1 w-full flex items-center justify-center py-10 lg:py-16 overflow-hidden">
        {/* Subtle Ambient Glow Orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary-fixed/40 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-secondary-fixed/40 blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Pane: Brand & Academic Features (7 cols) */}
            <section className="lg:col-span-7 flex flex-col pt-2 lg:pr-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-label text-xs font-semibold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Free Scholar Access
                </span>
                <span className="text-xs font-label text-outline uppercase tracking-widest font-medium">
                  02 // Onboarding
                </span>
              </div>

              <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl text-on-surface font-semibold tracking-tight leading-[1.08] mb-6">
                Elevate Your <br className="hidden sm:inline" />
                <span className="italic font-normal text-primary">Academic Mind.</span> Start <br className="hidden sm:inline" />
                Intelligent Recall.
              </h1>

              <p className="text-base sm:text-lg text-on-surface-variant font-body leading-relaxed max-w-2xl mb-10">
                Join thousands of students and researchers engineering high-retention memory vaults for competitive semester milestones.
              </p>

              {/* Onboarding Highlights */}
              <div className="space-y-4 max-w-xl mb-10">
                {[
                  {
                    step: '01',
                    title: 'Instant Syllabus & Document Ingestion',
                    desc: 'Drop in course PDFs or lecture slides to automatically generate smart flashcard decks and practice quizzes.',
                  },
                  {
                    step: '02',
                    title: 'FSRS v4.5 Adaptive Scheduling',
                    desc: 'Mathematical decay modeling eliminates unnecessary repeats and targets exact forgetting intervals.',
                  },
                  {
                    step: '03',
                    title: 'Semester Exam Countdown & Strategy',
                    desc: 'Dynamic pacing algorithms calculate day-by-day task lists so you finish syllabus review 7 days prior.',
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs"
                  >
                    <span className="font-label font-bold text-xs px-2.5 py-1 rounded-md bg-primary-fixed text-on-primary-fixed-variant">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="font-headline text-base font-semibold text-on-surface">{item.title}</h3>
                      <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Right Pane: Registration Form (5 cols) */}
            <section className="lg:col-span-5 w-full">
              <div className="relative bg-surface-container-lowest rounded-2xl p-7 sm:p-10 shadow-lg shadow-on-surface/5 border border-outline-variant/30 animate-slide-up">
                {/* Soft Accent Trim Top Line */}
                <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-60" />

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-label font-bold tracking-widest uppercase text-primary">
                      <span className="material-symbols-outlined text-sm">badge</span> Get Started
                    </span>
                    <span className="text-[10px] font-label text-outline">100% Free</span>
                  </div>
                  <h2 className="font-headline text-3xl font-semibold text-on-surface tracking-tight leading-tight">
                    Create Your Account
                  </h2>
                  <p className="text-xs text-on-surface-variant font-body mt-1 leading-relaxed">
                    Set up your account to start studying with flashcards, quizzes, and summaries.
                  </p>
                </div>

                {/* Google Sign-in */}
                <div className="mb-5">
                  <GoogleSignInButton onCredential={handleGoogle} />
                </div>

                <div className="relative flex items-center justify-center mb-5">
                  <div className="border-t border-outline-variant/40 w-full" />
                  <span className="bg-surface-container-lowest px-3 text-[10px] font-label uppercase tracking-widest text-outline shrink-0">
                    Or register with email
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
                    <label htmlFor="name" className="block text-[11px] font-label font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={authInputClass}
                        placeholder="Your Name"
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-[11px] font-label font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={authInputClass}
                        placeholder="name@example.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-[11px] font-label font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                      Password (min 8 characters)
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${authInputClass} pr-12`}
                        placeholder="••••••••••••"
                        autoComplete="new-password"
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

                  <div>
                    <label htmlFor="confirm" className="block text-[11px] font-label font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                      <input
                        id="confirm"
                        type={showPassword ? 'text' : 'password'}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        className={authInputClass}
                        placeholder="••••••••••••"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={isLoading} className={authButtonClass}>
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-xs text-on-surface-variant font-label mt-6">
                  Already registered?{' '}
                  <Link to="/login" className="font-semibold text-primary hover:underline">
                    Sign In
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

export default Register;
