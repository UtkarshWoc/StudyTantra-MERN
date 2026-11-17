import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { useTheme } from '../context/theme';

const titles = [
  ['/dashboard', 'Student Dashboard'],
  ['/review', 'Spaced Review Session'],
  ['/planner', 'Semester Exam Planner'],
  ['/collections', 'Collection Workspace'],
  ['/documents', 'Document Intelligence Library'],
  ['/flashcards', 'Flashcards Vault'],
  ['/quizzes', 'Interactive Quiz Engine'],
  ['/favorites', 'Curated Favorites'],
  ['/profile', 'Academic Profile'],
  ['/settings', 'Settings & Preferences'],
];

const Header = ({ onToggleMobileSidebar }) => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
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

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <header className="h-16 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/30 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-20 shadow-[0_1px_8px_rgba(58,48,42,0.04)]">
      {/* Mobile Drawer Trigger & Page Title */}
      <div className="flex items-center gap-4 flex-1 min-w-0 max-w-xl">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">menu</span>
          </button>
        )}

        {/* Global Search Input */}
        <form onSubmit={handleSearch} role="search" className="w-full relative">
          <span
            className={`material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] transition-colors pointer-events-none ${
              focused ? 'text-primary' : 'text-outline'
            }`}
          >
            search
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-label="Search documents"
            className={`w-full pl-10 pr-12 py-2 rounded-xl text-xs font-body text-on-surface placeholder:text-outline bg-surface-container-low border border-transparent focus:outline-none focus:border-primary/40 focus:bg-surface-container-lowest transition-all ${
              focused ? 'shadow-[0_2px_12px_rgba(194,101,42,0.08)]' : ''
            }`}
            placeholder="Search concepts, citations, flashcards, textbooks..."
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-label font-semibold text-outline bg-surface-container-high/60">
            ⌘K
          </kbd>
        </form>
      </div>

      {/* Right Controls: Active Deck, Theme, Notifications, Avatar */}
      <div className="flex items-center gap-3.5 shrink-0 ml-4">
        {/* Active Deck Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high/80 border border-outline-variant/40 text-xs text-on-surface-variant font-label">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-[11px] text-on-surface-variant font-medium">Active Deck:</span>
          <span className="font-semibold text-primary text-[11px] max-w-[140px] truncate">
            Cognitive Science
          </span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to Sahara Light' : 'Switch to Obsidian Dark'}
          title={theme === 'dark' ? 'Switch to Sahara Light' : 'Switch to Obsidian Dark'}
          className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications Icon with Badge */}
        <button
          aria-label="Notifications"
          className="relative p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-tertiary"></span>
        </button>

        {/* User Profile Avatar Pill */}
        <button
          onClick={() => navigate('/profile')}
          className="group flex items-center gap-2.5 p-1 rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
          aria-label="Profile"
        >
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold shadow-sm ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="text-right hidden sm:block leading-tight pr-1">
            <p className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">
              {user?.name || 'Arya Sharma'}
            </p>
            <p className="text-[10px] text-on-surface-variant font-label">
              Scholar
            </p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
