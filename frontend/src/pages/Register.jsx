import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(name, email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed. Please try again.');
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
          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
        }}
      >
        {/* Decorative shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10" style={{ background: 'white' }} />
          <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full opacity-10" style={{ background: 'white' }} />
          <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full opacity-5" style={{ background: 'white' }} />
        </div>

        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Join StudyTantra
          </h1>
          <p className="text-lg text-white/80 mb-8 leading-relaxed">
            Start transforming the way you study. Upload any PDF and let AI create flashcards, quizzes, and summaries for you — automatically.
          </p>

          <div className="space-y-4">
            {[
              { step: '1', label: 'Create your free account' },
              { step: '2', label: 'Upload your study materials (PDFs)' },
              { step: '3', label: 'Let AI generate flashcards & quizzes' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                  {item.step}
                </div>
                <span className="text-white/90 text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel – Registration Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Inter', sans-serif" }}>StudyTantra</h1>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: '#f3e8ff', color: '#7c3aed' }}>
                <Sparkles className="w-3 h-3" />
                Free to Get Started
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create your account</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Start your AI-powered learning journey</p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-xl text-sm font-medium" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="register-name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    id="register-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Min. 6 characters"
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

              <div>
                <label htmlFor="register-confirm-password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    id="register-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Re-enter your password"
                  />
                </div>
              </div>

              <button
                id="register-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] mt-2"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: '#7c3aed' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
