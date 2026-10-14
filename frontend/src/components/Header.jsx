import React, { useState } from 'react';
import { Search, Command } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

const titles = [
  ['/dashboard', 'Dashboard'],
  ['/review', 'Review'],
  ['/planner', 'Planner'],
  ['/collections', 'Collection'],
  ['/documents', 'Library'],
  ['/flashcards', 'Flashcards'],
  ['/quizzes', 'Quizzes'],
  ['/favorites', 'Favorites'],
  ['/profile', 'Profile'],
  ['/settings', 'Settings'],
];

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const title = titles.find(([path]) => location.pathname.startsWith(path))?.[1] || 'StudyTantra';

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/documents?q=${encodeURIComponent(q)}` : '/documents');
  };

  return (
    <header className="h-16 bg-[#0b1120]/60 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 flex items-center gap-6 min-w-0">
        <h1 className="text-base font-bold tracking-tight text-slate-100 shrink-0 hidden sm:block animate-fade-in">{title}</h1>
        <form onSubmit={handleSearch} role="search" className="max-w-md w-full relative hidden md:block">
          <Search size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${focused ? 'text-amber-400' : 'text-slate-500'}`} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-label="Search documents"
            className={`w-full pl-10 pr-16 py-2 rounded-xl bg-white/[0.04] border text-sm text-slate-200 placeholder-slate-500 focus:outline-none transition-all duration-300 ${focused ? 'border-amber-500/40 bg-white/[0.08] shadow-[0_0_20px_rgba(245,158,11,0.08)]' : 'border-white/[0.06]'}`}
            placeholder="Search documents..."
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium text-slate-500 bg-white/[0.06] border border-white/[0.08]">
            <Command size={10} />K
          </kbd>
        </form>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button onClick={() => navigate('/profile')} className="group flex items-center gap-2.5 hover:bg-white/[0.04] rounded-xl px-2.5 py-1.5 transition-all duration-200 cursor-pointer" aria-label="Profile">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xs font-extrabold shadow-lg shadow-amber-900/20 ring-2 ring-amber-500/20 group-hover:ring-amber-500/40 group-hover:shadow-amber-500/20 transition-all duration-300">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="text-right hidden md:block leading-tight">
            <p className="text-[13px] font-semibold text-slate-200 group-hover:text-white transition-colors">{user?.name || 'User'}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Free plan</p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
