import React, { useState } from 'react';
import {
  Bell,
  Shield,
  Palette,
  Moon,
  Sun,
  Monitor,
  CheckCircle2,
  GraduationCap,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/theme';
import { useAuth } from '../context/auth';
import { api, getErrorMessage } from '../lib/api';

const inputClass = "w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 rounded-xl focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(245,158,11,0.08)] transition-all duration-300";

const ChangePasswordForm = () => {
  const { user, changePassword } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [status, setStatus] = useState({ saving: false, error: '', success: false });

  if (!user?.hasPassword) {
    return (
      <p className="text-sm text-slate-400 max-w-md">
        You sign in with Google. To also sign in with a password, use <Link to="/forgot-password" className="text-amber-400 font-semibold link-underline">Forgot password</Link> and we will email you a link to set one.
      </p>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 8) return setStatus({ saving: false, error: 'New password must be at least 8 characters.', success: false });
    if (form.newPassword !== form.confirm) return setStatus({ saving: false, error: 'New passwords do not match.', success: false });
    setStatus({ saving: true, error: '', success: false });
    const res = await changePassword(form.currentPassword, form.newPassword);
    if (res.success) {
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
      setStatus({ saving: false, error: '', success: true });
    } else {
      setStatus({ saving: false, error: res.error, success: false });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
      <input type="password" autoComplete="current-password" placeholder="Current password" value={form.currentPassword}
        onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} className={inputClass} />
      <input type="password" autoComplete="new-password" placeholder="New password (min. 8 characters)" value={form.newPassword}
        onChange={(e) => setForm({ ...form, newPassword: e.target.value })} className={inputClass} />
      <input type="password" autoComplete="new-password" placeholder="Confirm new password" value={form.confirm}
        onChange={(e) => setForm({ ...form, confirm: e.target.value })} className={inputClass} />
      {status.error && <p className="text-sm text-red-400 animate-scale-in">{status.error}</p>}
      {status.success && <p className="text-sm text-emerald-400 flex items-center gap-1.5"><CheckCircle2 size={16} /> Password updated. Other devices were signed out.</p>}
      <button
        type="submit"
        disabled={status.saving || !form.currentPassword || !form.newPassword}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-[#0b1120] text-sm font-bold rounded-xl shadow-lg shadow-amber-900/20 btn-press disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {status.saving && <Loader2 size={16} className="animate-spin" />}
        Update Password
      </button>
    </form>
  );
};

const SessionsCard = () => {
  const [state, setState] = useState({ loading: false, message: '', error: '' });

  const logoutOthers = async () => {
    setState({ loading: true, message: '', error: '' });
    try {
      const { data } = await api.post('/auth/logout-others');
      setState({ loading: false, message: data.count ? `Signed out ${data.count} other session${data.count === 1 ? '' : 's'}.` : 'No other active sessions.', error: '' });
    } catch (error) {
      setState({ loading: false, message: '', error: getErrorMessage(error) });
    }
  };

  return (
    <div className="pt-6 border-t border-white/[0.06]">
      <h3 className="text-sm font-semibold text-white">Active Sessions</h3>
      <p className="text-sm text-slate-400 mb-4 mt-1">Sign out everywhere except this device.</p>
      <button onClick={logoutOthers} disabled={state.loading} className="cursor-pointer px-4 py-2.5 glass-card text-slate-300 text-sm font-medium rounded-xl hover:bg-white/[0.06] hover:border-amber-500/20 transition-all btn-press disabled:opacity-50 flex items-center gap-2">
        {state.loading && <Loader2 size={16} className="animate-spin" />}
        Log out other devices
      </button>
      {state.message && <p className="text-sm text-emerald-400 mt-3">{state.message}</p>}
      {state.error && <p className="text-sm text-red-400 mt-3">{state.error}</p>}
    </div>
  );
};

const StudySettings = () => {
  const { user, updatePreferences } = useAuth();
  const prefs = user?.preferences || {};
  const [form, setForm] = useState({ dailyGoal: prefs.dailyGoal ?? 20, newCardsPerDay: prefs.newCardsPerDay ?? 20, timezone: prefs.timezone || 'UTC' });
  const [status, setStatus] = useState({ saving: false, error: '', saved: false });
  const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const save = async (e) => {
    e.preventDefault();
    setStatus({ saving: true, error: '', saved: false });
    const res = await updatePreferences({ dailyGoal: Number(form.dailyGoal), newCardsPerDay: Number(form.newCardsPerDay), timezone: form.timezone });
    setStatus({ saving: false, error: res.success ? '' : res.error, saved: res.success });
  };

  return (
    <form onSubmit={save} className="space-y-5 max-w-md">
      <div>
        <label htmlFor="pref-goal" className="text-sm font-medium text-slate-300">Daily review goal (cards)</label>
        <input id="pref-goal" type="number" min={1} max={500} value={form.dailyGoal} onChange={(e) => setForm({ ...form, dailyGoal: e.target.value })} className={`${inputClass} mt-1.5`} />
      </div>
      <div>
        <label htmlFor="pref-new" className="text-sm font-medium text-slate-300">New flashcards per day</label>
        <input id="pref-new" type="number" min={0} max={200} value={form.newCardsPerDay} onChange={(e) => setForm({ ...form, newCardsPerDay: e.target.value })} className={`${inputClass} mt-1.5`} />
        <p className="text-xs text-slate-500 mt-1">How many never-seen cards spaced repetition introduces each day.</p>
      </div>
      <div>
        <label htmlFor="pref-tz" className="text-sm font-medium text-slate-300">Timezone</label>
        <div className="flex gap-2 mt-1.5">
          <input id="pref-tz" value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} className={inputClass} />
          {browserTz && browserTz !== form.timezone && (
            <button type="button" onClick={() => setForm({ ...form, timezone: browserTz })} className="whitespace-nowrap px-3 rounded-xl glass-card text-sm text-slate-300 cursor-pointer hover:text-amber-300 hover:border-amber-500/20 transition-all">Use {browserTz}</button>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-1">Used for streaks and your daily goal.</p>
      </div>
      {status.error && <p className="text-sm text-red-400">{status.error}</p>}
      {status.saved && <p className="text-sm text-emerald-400 flex items-center gap-1.5"><CheckCircle2 size={16} /> Saved.</p>}
      <button type="submit" disabled={status.saving} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-[#0b1120] text-sm font-bold rounded-xl shadow-lg shadow-amber-900/20 btn-press disabled:opacity-50 cursor-pointer">
        {status.saving && <Loader2 size={16} className="animate-spin" />} Save
      </button>
    </form>
  );
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState('study');
  const { theme, setTheme } = useTheme();

  const tabs = [
    { id: 'study', label: 'Study', icon: <GraduationCap size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ];

  const themeOptions = [
    { id: 'light', label: 'Light', icon: <Sun size={28} /> },
    { id: 'dark', label: 'Dark', icon: <Moon size={28} /> },
    { id: 'system', label: 'System', icon: <Monitor size={28} /> },
  ];

  return (
    <div className="flex-1 min-h-screen p-8 w-full animate-fade-in">
      <div className="max-w-4xl mx-auto flex flex-col items-start w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-sm font-medium text-slate-400 mt-2">Manage your preferences and security.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 w-full mt-4 items-start">
          <aside className="w-full md:w-64 shrink-0 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? 'glass-card text-amber-300'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className={`${activeTab === tab.id ? 'text-amber-400' : 'text-slate-500'} transition-colors`}>
                  {tab.icon}
                </div>
                {tab.label}
              </button>
            ))}
          </aside>

          <div className="flex-1 glass-card rounded-2xl p-8 w-full min-h-[400px]">
            {activeTab === 'study' && (
              <div className="space-y-8 animate-slide-up">
                <div className="border-b border-white/[0.06] pb-5">
                  <h2 className="text-lg font-semibold text-white">Study</h2>
                  <p className="text-sm text-slate-400 mt-1">Daily goal, spaced repetition and timezone.</p>
                </div>
                <StudySettings />
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-8 animate-slide-up">
                <div className="border-b border-white/[0.06] pb-5">
                  <h2 className="text-lg font-semibold text-white">Appearance</h2>
                  <p className="text-sm text-slate-400 mt-1">Customize how the app looks. Saved automatically.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {themeOptions.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setTheme(opt.id)}
                      className={`cursor-pointer flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${theme === opt.id ? 'border-amber-500/50 bg-amber-500/[0.06] shadow-[0_0_20px_rgba(245,158,11,0.08)]' : 'border-white/[0.08] hover:border-white/[0.15] bg-white/[0.02]'}`}
                    >
                      <div className={`h-20 w-full rounded-lg flex items-center justify-center ${theme === opt.id ? 'text-amber-400' : 'text-slate-500'} bg-white/[0.04]`}>
                        {opt.icon}
                      </div>
                      <span className={`text-sm font-medium ${theme === opt.id ? 'text-amber-300' : 'text-slate-400'}`}>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8 animate-slide-up">
                <div className="border-b border-white/[0.06] pb-5">
                  <h2 className="text-lg font-semibold text-white">Security</h2>
                  <p className="text-sm text-slate-400 mt-1">Manage your password and signed-in devices.</p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">Change Password</h3>
                  <ChangePasswordForm />
                </div>
                <SessionsCard />
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8 animate-slide-up">
                <div className="border-b border-white/[0.06] pb-5">
                  <h2 className="text-lg font-semibold text-white">Notifications</h2>
                  <p className="text-sm text-slate-400 mt-1">Study reminders by email are coming soon. We don't send any notifications yet.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
