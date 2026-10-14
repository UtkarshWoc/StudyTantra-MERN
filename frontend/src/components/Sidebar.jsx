import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Layers, Target, Star, User, Settings, LogOut, Hexagon, ChevronLeft, ChevronRight, Brain, CalendarDays } from 'lucide-react';
import { useInsights } from '../api/hooks';
import { useAuth } from '../context/auth';

const nav = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Review', path: '/review', icon: Brain, badge: 'due' },
  { name: 'Library', path: '/documents', icon: FileText },
  { name: 'Flashcards', path: '/flashcards', icon: Layers },
  { name: 'Quizzes', path: '/quizzes', icon: Target },
  { name: 'Planner', path: '/planner', icon: CalendarDays },
  { name: 'Favorites', path: '/favorites', icon: Star },
];

const accountNav = [
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { logout } = useAuth();
  const { data: insights } = useInsights();
  const due = insights ? insights.due.reviews + insights.due.new : 0;
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const linkClasses = (isActive) =>
    `group relative flex items-center ${isCollapsed ? 'justify-center px-2.5' : 'px-3'} py-2.5 text-[13px] font-medium rounded-xl transition-all duration-200 ${
      isActive
        ? 'bg-amber-500/10 text-amber-300'
        : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
    }`;

  return (
    <aside
      className={`${isCollapsed ? 'w-[72px]' : 'w-64'} flex-col bg-[#0b1120]/80 backdrop-blur-xl border-r border-white/[0.06] h-screen sticky top-0 z-20 transition-all duration-300`}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'justify-between px-5'} h-16 shrink-0`}>
        {!isCollapsed && (
          <a href="/dashboard" className="flex items-center gap-2.5 group" aria-label="StudyTantra Home">
            <span className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-900/20 group-hover:shadow-amber-500/30 transition-all duration-300">
              <Hexagon size={20} strokeWidth={2.5} />
            </span>
            <div>
              <h1 className="text-[15px] font-extrabold leading-none tracking-tight text-slate-100">StudyTantra</h1>
              <span className="text-[10px] font-medium text-slate-500 tracking-wide uppercase">AI Study</span>
            </div>
          </a>
        )}
        {isCollapsed && (
          <span className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-900/20">
            <Hexagon size={20} strokeWidth={2.5} />
          </span>
        )}
      </div>

      {/* Collapse toggle */}
      <div className="px-3 mb-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-full flex items-center justify-center p-1.5 rounded-lg hover:bg-white/[0.04] text-slate-500 hover:text-slate-300 transition-all duration-200 cursor-pointer"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-1 space-y-0.5" style={{ scrollbarWidth: 'thin' }}>
        {nav.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            title={isCollapsed ? item.name : undefined}
            className={({ isActive }) => linkClasses(isActive)}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                )}
                <item.icon size={18} strokeWidth={1.8} className={`${isCollapsed ? 'mx-auto' : 'mr-2.5'} shrink-0 transition-transform duration-200 group-hover:scale-110`} />
                {!isCollapsed && <span className="truncate flex-1">{item.name}</span>}
                {item.badge === 'due' && due > 0 && (
                  <span aria-label={`${due} cards due`} className={`${isCollapsed ? 'absolute -top-0.5 -right-0.5' : ''} min-w-5 px-1.5 py-0.5 rounded-full bg-amber-500 text-[#0b1120] text-[10px] font-extrabold text-center shadow-lg shadow-amber-500/30`}>{due > 99 ? '99+' : due}</span>
                )}
              </>
            )}
          </NavLink>
        ))}

        <div className={`pt-6 pb-2 ${isCollapsed ? 'px-1 text-center' : 'px-3'}`}>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.12em]">Account</p>
        </div>

        {accountNav.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            title={isCollapsed ? item.name : undefined}
            className={({ isActive }) => linkClasses(isActive)}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                )}
                <item.icon size={18} strokeWidth={1.8} className={`${isCollapsed ? 'mx-auto' : 'mr-2.5'} shrink-0 transition-transform duration-200 group-hover:scale-110`} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="shrink-0 px-3 py-3 border-t border-white/[0.06]">
        <button
          onClick={handleLogout}
          aria-label="Sign out"
          className={`group flex ${isCollapsed ? 'justify-center px-2.5' : 'px-3'} items-center py-2.5 text-[13px] font-medium rounded-xl text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 w-full cursor-pointer`}
        >
          <LogOut size={18} strokeWidth={1.8} className={`${isCollapsed ? 'mx-auto' : 'mr-2.5'} shrink-0 transition-transform duration-200 group-hover:scale-110`} />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
