import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Mail, Lock, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel – Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)',
        }}
      >
        {/* Decorative shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-10" style={{ background: 'white' }} />
          <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full opacity-10" style={{ background: 'white' }} />
          <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full opacity-5" style={{ background: 'white' }} />
        </div>

        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            StudyTantra
          </h1>
          <p className="text-lg text-white/80 mb-8 leading-relaxed">
            Transform your PDFs into an interactive study experience powered by AI — flashcards, quizzes, summaries, and intelligent chat, all in one place.
          </p>

          <div className="space-y-4">
            {[
              { icon: '📚', label: 'AI-Powered Flashcards & Quizzes' },
              { icon: '💬', label: 'Chat with your Documents' },
              { icon: '📊', label: 'Track your Learning Progress' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                <span className="text-xl">{feature.icon}</span>
                <span className="text-white/90 text-sm font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel – Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Inter', sans-serif" }}>StudyTantra</h1>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: '#eef2ff', color: '#4f46e5' }}>
                <Sparkles className="w-3 h-3" />
                AI-Powered Learning
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome back</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Sign in to continue your learning journey</p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-xl text-sm font-medium" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: '#4f46e5' }}>
              Create one for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
