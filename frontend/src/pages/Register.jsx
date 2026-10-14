import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { BookOpen, Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles, ArrowRight } from 'lucide-react';

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
    e.preventDefault(); setError('');
    if (!name || !email || !password || !confirm) { setError('Fill all fields.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setIsLoading(true);
    try { const result = await register(name, email, password); if (result.success) navigate('/dashboard'); else setError(result.error || 'Registration failed.'); } catch { setError('Unexpected error.'); } finally { setIsLoading(false); }
  };

  const handleGoogle = async (credential) => {
    setError(''); setIsLoading(true);
    const result = await loginWithGoogle(credential);
    setIsLoading(false);
    if (result.success) navigate('/dashboard'); else setError(result.error);
  };

  return (
    <div className="min-h-screen flex bg-[#0b1120] overflow-hidden">
      <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-amber-500/[0.07] blur-[100px] animate-float" />
          <div className="absolute top-20 left-20 w-[350px] h-[350px] rounded-full bg-amber-400/[0.05] blur-[80px] animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative z-10 text-center px-12 max-w-xl animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-2xl shadow-amber-900/30 glow-amber"><BookOpen size={32} strokeWidth={2} /></div>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">Join StudyTantra</h1>
          <p className="text-lg text-slate-400 mb-10 leading-relaxed">Start transforming the way you study. Upload any PDF and let AI create flashcards, quizzes, and summaries.</p>
          <div className="space-y-3 text-left stagger-children">
            {[
              { step: '1', label: 'Create your account', desc: 'Free, no credit card' },
              { step: '2', label: 'Upload study materials', desc: 'PDF format, up to 10MB' },
              { step: '3', label: 'Generate flashcards & quizzes', desc: 'AI-powered in seconds' },
            ].map((item, i) => (
              <div key={i} className="glass-card glass-card-hover flex items-center gap-4 p-4 rounded-2xl group cursor-default">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold bg-gradient-to-br from-amber-400 to-amber-600 text-[#0b1120] shadow-lg group-hover:shadow-amber-500/30 transition-all duration-300">{item.step}</div>
                <div>
                  <span className="text-sm font-semibold text-slate-200 block">{item.label}</span>
                  <span className="text-xs text-slate-500">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg"><BookOpen size={22} /></div>
            <h1 className="text-2xl font-extrabold text-slate-100">StudyTantra</h1>
          </div>
          <div className="glass-card rounded-3xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 bg-amber-500/10 text-amber-300 border border-amber-500/20"><Sparkles size={12} /> Free to Get Started</div>
              <h2 className="text-2xl font-extrabold text-white mb-1">Create your account</h2>
              <p className="text-sm text-slate-400">Start your AI-powered learning journey</p>
            </div>
            {error && (<div className="mb-6 p-3 rounded-xl text-sm font-semibold bg-red-500/10 text-red-300 border border-red-500/20 animate-scale-in">{error}</div>)}
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { id: 'name', label: 'Full Name', placeholder: 'John Doe', icon: User, value: name, onChange: setName, type: 'text' },
                { id: 'email', label: 'Email', placeholder: 'you@example.com', icon: Mail, value: email, onChange: setEmail, type: 'email' },
                { id: 'password', label: 'Password', placeholder: 'Min. 8 characters', icon: Lock, value: password, onChange: setPassword, type: showPassword ? 'text' : 'password' },
                { id: 'confirm', label: 'Confirm Password', placeholder: 'Re-enter password', icon: Lock, value: confirm, onChange: setConfirm, type: showPassword ? 'text' : 'password' },
              ].map(field => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{field.label}</label>
                  <div className="relative group">
                    <field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                    <input id={field.id} type={field.type} value={field.value} onChange={e => field.onChange(e.target.value)} className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(245,158,11,0.08)] transition-all duration-300" placeholder={field.placeholder} />
                    {(field.id === 'password' || field.id === 'confirm') && (
                      <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                    )}
                  </div>
                </div>
              ))}
              <button type="submit" disabled={isLoading} className="w-full py-3 rounded-xl text-[#0b1120] font-extrabold text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 shadow-lg shadow-amber-900/30 hover:shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-60 btn-press cursor-pointer">
                {isLoading ? <><Loader2 className="animate-spin w-4 h-4" /> Creating account...</> : <>Create Account <ArrowRight size={16} /></>}
              </button>
            </form>
            <GoogleSignInButton onCredential={handleGoogle} text="signup_with" />
            <p className="text-center text-sm text-slate-500 mt-6">Already have an account? <Link to="/login" className="font-bold text-amber-400 hover:text-amber-300 link-underline">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
