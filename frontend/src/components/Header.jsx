import React from 'react';
import { Search, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-[#111827]/80 backdrop-blur-md border-b border-[#334155]/60 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 flex items-center gap-6 min-w-0">
        <h1 className="text-lg font-extrabold tracking-tight text-slate-100 shrink-0 hidden sm:block">Dashboard</h1>
        <div className="max-w-lg w-full relative hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0b1120] border border-[#334155]/60 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all shadow-inner shadow-black/20"
            placeholder="Search documents, topics..."
          />
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button aria-label="Notifications" className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-amber-300 transition-colors relative cursor-pointer">
          <Bell size={18} strokeWidth={1.8} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-[#111827]" aria-hidden />
        </button>

        <div className="h-6 w-px bg-[#334155]/60 mx-0.5" />

        <button className="flex items-center gap-2.5 hover:bg-white/5 rounded-xl px-2 py-1.5 transition-colors cursor-pointer" aria-label="Profile">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-xs font-extrabold shadow-lg shadow-amber-900/30 ring-2 ring-amber-500/20">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="text-right hidden md:block leading-tight">
            <p className="text-[13px] font-semibold text-slate-200">{user?.name || 'User'}</p>
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium mt-0.5">
              <Sparkles size={10} /> Pro Plan
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
