import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { BookOpen, Mail, Lock, Eye, EyeOff, Loader2, Sparkles, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setIsLoading(true);
    try { const result = await login(email, password); if (result.success) navigate('/dashboard'); else setError(result.error || 'Login failed.'); } catch { setError('Unexpected error.'); } finally { setIsLoading(false); }
  };

  const handleGoogle = async (credential) => {
    setError(''); setIsLoading(true);
    const result = await loginWithGoogle(credential);
    setIsLoading(false);
    if (result.success) navigate('/dashboard'); else setError(result.error);
  };

  return (
    <div className="min-h-screen flex bg-[#0b1120] overflow-hidden">
      {/* Left Brand */}
      <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-amber-500/[0.07] blur-[100px] animate-float" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-amber-400/[0.05] blur-[80px] animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-amber-600/[0.04] blur-[60px] animate-float" style={{ animationDelay: '4s' }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative z-10 text-center px-12 max-w-xl animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-2xl shadow-amber-900/30 glow-amber">
              <BookOpen size={32} strokeWidth={2} />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">StudyTantra</h1>
          <p className="text-lg text-slate-400 mb-12 leading-relaxed">Transform your PDFs into interactive study experiences powered by AI — flashcards, quizzes, and intelligent chat.</p>
          <div className="grid grid-cols-3 gap-3 stagger-children">
            {[
              { icon: '📚', label: 'AI Flashcards', desc: 'Auto-generated decks' },
              { icon: '💬', label: 'Chat with Docs', desc: 'RAG-powered answers' },
              { icon: '📊', label: 'Track Progress', desc: 'Spaced repetition' },
            ].map((f, i) => (
              <div key={i} className="glass-card glass-card-hover p-4 rounded-2xl text-left group cursor-default">
                <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">{f.icon}</span>
                <span className="text-sm font-semibold text-slate-200 block">{f.label}</span>
                <span className="text-xs text-slate-500 mt-0.5 block">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg"><BookOpen size={22} /></div>
            <h1 className="text-2xl font-extrabold text-slate-100">StudyTantra</h1>
          </div>
          <div className="glass-card rounded-3xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 bg-amber-500/10 text-amber-300 border border-amber-500/20"><Sparkles size={12} /> AI-Powered Learning</div>
              <h2 className="text-2xl font-extrabold text-white mb-1">Welcome back</h2>
              <p className="text-sm text-slate-400">Sign in to continue your journey</p>
            </div>
            {error && (<div className="mb-6 p-3 rounded-xl text-sm font-semibold bg-red-500/10 text-red-300 border border-red-500/20 animate-scale-in">{error}</div>)}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                  <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(245,158,11,0.08)] transition-all duration-300" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-amber-400 hover:text-amber-300 link-underline">Forgot password?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                  <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(245,158,11,0.08)] transition-all duration-300" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full py-3 rounded-xl text-[#0b1120] font-extrabold text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 shadow-lg shadow-amber-900/30 hover:shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-60 btn-press cursor-pointer">
                {isLoading ? <><Loader2 className="animate-spin w-4 h-4" /> Signing in...</> : <>Sign In <ArrowRight size={16} /></>}
              </button>
            </form>
            <GoogleSignInButton onCredential={handleGoogle} />
            <p className="text-center text-sm text-slate-500 mt-6">New here? <Link to="/register" className="font-bold text-amber-400 hover:text-amber-300 link-underline">Create an account</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
