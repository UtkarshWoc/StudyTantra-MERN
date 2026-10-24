import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const authInputClass = "w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(245,158,11,0.08)] transition-all duration-300";
export const authButtonClass = "w-full py-3 rounded-xl text-[#0b1120] font-extrabold text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 shadow-lg shadow-amber-900/30 hover:shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-60 btn-press cursor-pointer";

// Centered card used by the smaller auth screens (forgot/reset password, verify email).
const AuthCard = ({ title, subtitle, children, footer }) => (
  <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#0b1120] overflow-hidden relative">
    {/* Background orb */}
    <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/[0.04] blur-[80px] animate-float" />
    <div className="w-full max-w-md relative z-10 animate-slide-up">
      <Link to="/login" className="flex items-center justify-center gap-3 mb-8 group">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg group-hover:shadow-amber-500/30 transition-all duration-300"><BookOpen size={22} /></div>
        <span className="text-2xl font-extrabold text-slate-100">StudyTantra</span>
      </Link>
      <div className="glass-card rounded-3xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-white mb-1">{title}</h1>
          {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
        </div>
        {children}
      </div>
      {footer && <div className="text-center text-sm text-slate-500 mt-6">{footer}</div>}
    </div>
  </div>
);

export default AuthCard;
