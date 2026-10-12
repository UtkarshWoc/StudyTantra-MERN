import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

const titles = [
  ['/dashboard', 'Dashboard'],
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

  const title = titles.find(([path]) => location.pathname.startsWith(path))?.[1] || 'StudyTantra';

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/documents?q=${encodeURIComponent(q)}` : '/documents');
  };

  return (
    <header className="h-16 bg-[#111827]/80 backdrop-blur-md border-b border-[#334155]/60 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 flex items-center gap-6 min-w-0">
        <h1 className="text-lg font-extrabold tracking-tight text-slate-100 shrink-0 hidden sm:block">{title}</h1>
        <form onSubmit={handleSearch} role="search" className="max-w-lg w-full relative hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search documents"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0b1120] border border-[#334155]/60 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all shadow-inner shadow-black/20"
            placeholder="Search documents..."
          />
        </form>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button onClick={() => navigate('/profile')} className="flex items-center gap-2.5 hover:bg-white/5 rounded-xl px-2 py-1.5 transition-colors cursor-pointer" aria-label="Profile">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-xs font-extrabold shadow-lg shadow-amber-900/30 ring-2 ring-amber-500/20">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="text-right hidden md:block leading-tight">
            <p className="text-[13px] font-semibold text-slate-200">{user?.name || 'User'}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Free plan</p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
