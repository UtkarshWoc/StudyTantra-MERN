import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (!name || !email || !password || !confirm) { setError('Fill all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setIsLoading(true);
    try { const result = await register(name, email, password); if (result.success) navigate('/dashboard'); else setError(result.error || 'Registration failed.'); } catch (err) { setError('Unexpected error.'); } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-[#0b1120]">
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden items-center justify-center bg-gradient-to-br from-[#1e293b] via-[#111827] to-[#0b1120]">
        <div className="absolute inset-0 overflow-hidden"><div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" /></div>
        <div className="relative z-10 text-center px-12 max-w-xl">
          <div className="flex items-center justify-center gap-3 mb-8"><div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-xl shadow-amber-900/30"><BookOpen size={32} strokeWidth={2} /></div></div>
          <h1 className="text-5xl font-extrabold text-slate-50 mb-4 tracking-tight">Join StudyTantra</h1>
          <p className="text-lg text-slate-400 mb-10 leading-relaxed">Start transforming the way you study. Upload any PDF and let AI create flashcards, quizzes, and summaries.</p>
          <div className="space-y-3 text-left">
            {[
              { step: '1', label: 'Create your account' },
              { step: '2', label: 'Upload study materials' },
              { step: '3', label: 'Generate flashcards & quizzes' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-extrabold bg-amber-500 text-[#0b1120]">{item.step}</div>
                <span className="text-sm font-semibold text-slate-200">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#0b1120]">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8"><div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white"><BookOpen size={22} /></div><h1 className="text-2xl font-extrabold text-slate-100">StudyTantra</h1></div>
          <div className="bg-[#111827] rounded-3xl shadow-2xl border border-[#334155]/60 p-8 backdrop-blur-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold mb-4 bg-amber-500/10 text-amber-300 border border-amber-500/20"><Sparkles size={12} /> Free to Get Started</div>
              <h2 className="text-2xl font-extrabold text-slate-100 mb-1">Create your account</h2>
              <p className="text-sm text-slate-400">Start your AI-powered learning journey</p>
            </div>
            {error && (<div className="mb-6 p-3 rounded-xl text-sm font-semibold bg-red-950/30 text-red-300 border border-red-800/40">{error}</div>)}
            <form onSubmit={handleSubmit} className="space-y-4">
              {[ { id: 'name', label: 'Full Name', placeholder: 'John Doe', icon: User, value: name, onChange: setName, type: 'text' }, { id: 'email', label: 'Email', placeholder: 'you@example.com', icon: Mail, value: email, onChange: setEmail, type: 'email' }, { id: 'password', label: 'Password', placeholder: 'Min. 6 characters', icon: Lock, value: password, onChange: setPassword, type: showPassword ? 'text' : 'password' }, { id: 'confirm', label: 'Confirm Password', placeholder: 'Re-enter password', icon: Lock, value: confirm, onChange: setConfirm, type: showPassword ? 'text' : 'password' }, ].map(field => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">{field.label}</label>
                  <div className="relative"><field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input id={field.id} type={field.type} value={field.value} onChange={e => field.onChange(e.target.value)} className="w-full pl-10 pr-12 py-3 rounded-xl bg-[#0b1120] border border-[#334155]/60 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all" placeholder={field.placeholder} />{field.id === 'password' || field.id === 'confirm' ? <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"><EyeOff size={16} />{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button> : null}</div>
                </div>
              ))}
              <button type="submit" disabled={isLoading} className="w-full py-3 rounded-xl text-[#0b1120] font-extrabold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-amber-900/30 bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer">{isLoading ? <><Loader2 className="animate-spin w-4 h-4" /> Creating account...</> : 'Create Account'}</button>
            </form>
            <p className="text-center text-sm text-slate-500 mt-6">Already have an account? <Link to="/login" className="font-bold text-amber-400 hover:text-amber-300 transition-colors">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
