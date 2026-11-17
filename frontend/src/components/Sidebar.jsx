import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Layers,
  Target,
  Star,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Brain,
  CalendarDays,
  Sparkles,
} from 'lucide-react';
import { useInsights } from '../api/hooks';
import { useAuth } from '../context/auth';

const nav = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, symbol: 'grid_view' },
  { name: 'Spaced Review', path: '/review', icon: Brain, symbol: 'update', badge: 'due' },
  { name: 'Document Library', path: '/documents', icon: FileText, symbol: 'folder_open' },
  { name: 'Flashcards Vault', path: '/flashcards', icon: Layers, symbol: 'style' },
  { name: 'Quiz Engine', path: '/quizzes', icon: Target, symbol: 'psychology' },
  { name: 'Exam Planner', path: '/planner', icon: CalendarDays, symbol: 'calendar_month' },
  { name: 'Favorites', path: '/favorites', icon: Star, symbol: 'star' },
];

const accountNav = [
  { name: 'Profile', path: '/profile', icon: User, symbol: 'person' },
  { name: 'Settings & Preferences', path: '/settings', icon: Settings, symbol: 'settings' },
];

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();
  const { data: insights } = useInsights();
  const due = insights ? (insights.due?.reviews || 0) + (insights.due?.new || 0) : 0;
  const streak = insights?.streak?.current || 14;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const linkClasses = (isActive) =>
    `group relative flex items-center ${isCollapsed ? 'justify-center px-2.5' : 'px-3.5'} py-2.5 text-xs font-label font-medium rounded-xl transition-all duration-200 ${
      isActive
        ? 'bg-primary text-on-primary font-semibold shadow-[0_2px_12px_rgba(194,101,42,0.18)]'
        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
    }`;

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-72'
      } flex flex-col bg-surface-container-low border-r border-outline-variant/30 h-screen sticky top-0 z-30 transition-all duration-300 shadow-[0_1px_8px_rgba(58,48,42,0.04)] justify-between select-none`}
      aria-label="Main navigation"
    >
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-4 py-6" style={{ scrollbarWidth: 'none' }}>
        {/* Brand Logo Header */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-6 px-1`}>
          <a href="/dashboard" className="flex items-center gap-3 group" aria-label="StudyTantra Home">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">local_library</span>
            </div>
            {!isCollapsed && (
              <div>
                <span className="font-headline font-semibold text-2xl tracking-tight text-on-surface block leading-none">
                  StudyTantra
                </span>
                <span className="text-[10px] font-label uppercase tracking-widest text-primary font-bold mt-1 block">
                  AI Spaced Recall
                </span>
              </div>
            )}
          </a>
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              aria-label="Collapse sidebar"
              className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {isCollapsed && (
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setIsCollapsed(false)}
              aria-label="Expand sidebar"
              className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Primary Navigation Links */}
        <nav className="flex flex-col gap-1.5" aria-label="Primary">
          {nav.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              title={isCollapsed ? item.name : undefined}
              className={({ isActive }) => linkClasses(isActive)}
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isCollapsed ? 'mx-auto' : 'mr-3'
                    } shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-on-primary' : 'text-on-surface-variant group-hover:text-on-surface'
                    }`}
                  >
                    {item.symbol}
                  </span>
                  {!isCollapsed && <span className="truncate flex-1">{item.name}</span>}
                  {item.badge === 'due' && due > 0 && (
                    <span
                      aria-label={`${due} cards due`}
                      className={`${
                        isCollapsed ? 'absolute -top-1 -right-1' : ''
                      } min-w-5 px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-surface-container-lowest text-primary' : 'bg-primary text-on-primary'
                      } text-[10px] font-label font-bold text-center shadow-sm`}
                    >
                      {due > 99 ? '99+' : due}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Account Section Divider */}
        <div className={`mt-6 mb-2 ${isCollapsed ? 'text-center' : 'px-3'}`}>
          <span className="text-[10px] font-label font-bold text-outline uppercase tracking-widest">
            {isCollapsed ? '•••' : 'Account'}
          </span>
        </div>

        <nav className="flex flex-col gap-1.5" aria-label="Account">
          {accountNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              title={isCollapsed ? item.name : undefined}
              className={({ isActive }) => linkClasses(isActive)}
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isCollapsed ? 'mx-auto' : 'mr-3'
                    } shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-on-primary' : 'text-on-surface-variant group-hover:text-on-surface'
                    }`}
                  >
                    {item.symbol}
                  </span>
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Habit & User Section */}
      <div className="p-4 border-t border-outline-variant/30 flex flex-col gap-3">
        {!isCollapsed && (
          <div className="p-3.5 rounded-xl bg-surface-container flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[18px]">flare</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-label font-medium uppercase tracking-wider text-on-surface-variant truncate">
                  Mindful Habit
                </span>
                <span className="text-xs font-semibold text-on-surface font-label truncate">
                  {streak} Days Streak
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-primary font-label bg-surface px-2 py-0.5 rounded-md shrink-0 shadow-sm">
              Lv. 4
            </span>
          </div>
        )}

        {/* User Card & Sign Out */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-2 pt-1`}>
          <div
            onClick={() => navigate('/profile')}
            className={`flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity ${
              isCollapsed ? '' : 'min-w-0 flex-1'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold shrink-0 shadow-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-on-surface truncate leading-tight">
                  {user?.name || 'Arya Sharma'}
                </span>
                <span className="text-[10px] text-on-surface-variant font-label truncate leading-tight">
                  Scholar Plan
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            aria-label="Sign out"
            title="Sign out"
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors cursor-pointer shrink-0"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
