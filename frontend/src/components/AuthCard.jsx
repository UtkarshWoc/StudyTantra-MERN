import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const authInputClass = "w-full pl-10 pr-4 py-3 rounded-xl bg-[#0b1120] border border-[#334155]/60 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all";
export const authButtonClass = "w-full py-3 rounded-xl text-[#0b1120] font-extrabold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-amber-900/30 bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer";

// Centered card used by the smaller auth screens (forgot/reset password, verify email).
const AuthCard = ({ title, subtitle, children, footer }) => (
  <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#0b1120]">
    <div className="w-full max-w-md">
      <Link to="/login" className="flex items-center justify-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white"><BookOpen size={22} /></div>
        <span className="text-2xl font-extrabold text-slate-100">StudyTantra</span>
      </Link>
      <div className="bg-[#111827] rounded-3xl shadow-2xl border border-[#334155]/60 p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-slate-100 mb-1">{title}</h1>
          {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
        </div>
        {children}
      </div>
      {footer && <div className="text-center text-sm text-slate-500 mt-6">{footer}</div>}
    </div>
  </div>
);

export default AuthCard;
