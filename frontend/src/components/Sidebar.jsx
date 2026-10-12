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

  return (
    <aside
      className={`${isCollapsed ? 'w-20' : 'w-72'} flex-col bg-[#111827]/90 backdrop-blur-xl border-r border-[#334155]/60 h-screen sticky top-0 z-20 transition-all duration-300`}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'justify-between px-5'} h-16 shrink-0`}>
        {!isCollapsed && (
          <a href="/dashboard" className="flex items-center gap-2.5 group" aria-label="StudyTantra Home">
            <span className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-900/20 group-hover:shadow-amber-900/40 transition-all">
              <Hexagon size={22} strokeWidth={2.5} />
            </span>
            <div>
              <h1 className="text-[15px] font-extrabold leading-none tracking-tight text-slate-100">StudyTantra</h1>
              <span className="text-[10px] font-medium text-slate-500 tracking-wide uppercase">Enterprise</span>
            </div>
          </a>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 space-y-0.5" style={{ scrollbarWidth: 'thin' }}>
        {nav.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            title={isCollapsed ? item.name : undefined}
            className={({ isActive }) =>
              `group flex items-center ${isCollapsed ? 'justify-center px-2.5' : 'px-3'} py-2.5 text-[13px] font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/15 to-amber-600/5 text-amber-300 shadow-inner shadow-amber-900/10'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-white/[0.05]'
              }`
            }
          >
            <item.icon size={18} strokeWidth={1.8} className={isCollapsed ? 'mx-auto' : 'mr-2.5 shrink-0'} />
            {!isCollapsed && <span className="truncate flex-1">{item.name}</span>}
            {item.badge === 'due' && due > 0 && (
              <span aria-label={`${due} cards due`} className={`${isCollapsed ? 'absolute ml-6 -mt-5' : ''} min-w-5 px-1.5 py-0.5 rounded-full bg-amber-500 text-[#0b1120] text-[10px] font-extrabold text-center`}>{due > 99 ? '99+' : due}</span>
            )}
          </NavLink>
        ))}

        <div className={`pt-6 pb-2 px-3 ${isCollapsed ? 'text-center' : ''}`}>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.12em]">Account</p>
        </div>

        {accountNav.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            title={isCollapsed ? item.name : undefined}
            className={({ isActive }) =>
              `group flex items-center ${isCollapsed ? 'justify-center px-2.5' : 'px-3'} py-2.5 text-[13px] font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/15 to-amber-600/5 text-amber-300 shadow-inner shadow-amber-900/10'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-white/[0.05]'
              }`
            }
          >
            <item.icon size={18} strokeWidth={1.8} className={isCollapsed ? 'mx-auto' : 'mr-2.5 shrink-0'} />
            {!isCollapsed && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="shrink-0 px-3 py-3 border-t border-[#334155]/60">
        <button
          onClick={handleLogout}
          aria-label="Sign out"
          className={`group flex ${isCollapsed ? 'justify-center px-2.5' : 'px-3'} items-center py-2.5 text-[13px] font-medium rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors w-full cursor-pointer`}
        >
          <LogOut size={18} strokeWidth={1.8} className={isCollapsed ? 'mx-auto' : 'mr-2.5 shrink-0'} />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
