import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/theme';
import { useAuth } from '../context/auth';
import { api, getErrorMessage } from '../lib/api';

const inputClass =
  'w-full px-4 py-3 bg-surface-container-low border border-outline-variant/40 text-on-surface placeholder:text-outline rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all';
const labelClass = 'block text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant mb-1.5';

const ChangePasswordForm = () => {
  const { user, changePassword } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [status, setStatus] = useState({ saving: false, error: '', success: false });

  if (!user?.hasPassword) {
    return (
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface-variant leading-relaxed">
        You sign in with Google. To also sign in with a password, use{' '}
        <Link to="/forgot-password" className="text-primary font-bold hover:underline">
          Forgot Password
        </Link>{' '}
        and we will email you a link to set one.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 8) {
      return setStatus({ saving: false, error: 'New password must be at least 8 characters.', success: false });
    }
    if (form.newPassword !== form.confirm) {
      return setStatus({ saving: false, error: 'New passwords do not match.', success: false });
    }
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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className={labelClass}>Current Password</label>
        <input
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>New Password (min. 8 characters)</label>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Confirm New Password</label>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          className={inputClass}
        />
      </div>

      {status.error && <p className="text-xs text-error font-medium">{status.error}</p>}
      {status.success && (
        <p className="text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 font-medium">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>Password updated. Other sessions were signed out.</span>
        </p>
      )}

      <button
        type="submit"
        disabled={status.saving || !form.currentPassword || !form.newPassword}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label text-xs font-bold shadow-sm transition-all duration-150 transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {status.saving && <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>}
        <span>Update Password</span>
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
      setState({
        loading: false,
        message: data.count
          ? `Signed out ${data.count} other session${data.count === 1 ? '' : 's'}.`
          : 'No other active sessions.',
        error: '',
      });
    } catch (error) {
      setState({ loading: false, message: '', error: getErrorMessage(error) });
    }
  };

  return (
    <div className="pt-6 border-t border-outline-variant/20">
      <h3 className="font-headline text-lg font-bold text-on-surface">Active Sessions</h3>
      <p className="text-xs text-on-surface-variant mb-4 mt-1">
        Sign out everywhere except this device.
      </p>
      <button
        onClick={logoutOthers}
        disabled={state.loading}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-label font-bold transition-colors cursor-pointer disabled:opacity-50"
      >
        {state.loading && <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>}
        <span>Log Out Other Devices</span>
      </button>
      {state.message && (
        <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-2 font-medium">{state.message}</p>
      )}
      {state.error && <p className="text-xs text-error mt-2 font-medium">{state.error}</p>}
    </div>
  );
};

const StudySettings = () => {
  const { user, updatePreferences } = useAuth();
  const prefs = user?.preferences || {};
  const [form, setForm] = useState({
    dailyGoal: prefs.dailyGoal ?? 20,
    newCardsPerDay: prefs.newCardsPerDay ?? 20,
    timezone: prefs.timezone || 'UTC',
  });
  const [status, setStatus] = useState({ saving: false, error: '', saved: false });
  const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const save = async (e) => {
    e.preventDefault();
    setStatus({ saving: true, error: '', saved: false });
    const res = await updatePreferences({
      dailyGoal: Number(form.dailyGoal),
      newCardsPerDay: Number(form.newCardsPerDay),
      timezone: form.timezone,
    });
    setStatus({ saving: false, error: res.success ? '' : res.error, saved: res.success });
  };

  return (
    <form onSubmit={save} className="space-y-5 max-w-md">
      <div>
        <label htmlFor="pref-goal" className={labelClass}>
          Daily Review Goal (Cards)
        </label>
        <input
          id="pref-goal"
          type="number"
          min={1}
          max={500}
          value={form.dailyGoal}
          onChange={(e) => setForm({ ...form, dailyGoal: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="pref-new" className={labelClass}>
          New Flashcards Per Day
        </label>
        <input
          id="pref-new"
          type="number"
          min={0}
          max={200}
          value={form.newCardsPerDay}
          onChange={(e) => setForm({ ...form, newCardsPerDay: e.target.value })}
          className={inputClass}
        />
        <p className="text-[11px] text-on-surface-variant mt-1">
          How many never-seen cards spaced repetition introduces each day.
        </p>
      </div>

      <div>
        <label htmlFor="pref-tz" className={labelClass}>
          Timezone
        </label>
        <div className="flex gap-2">
          <input
            id="pref-tz"
            value={form.timezone}
            onChange={(e) => setForm({ ...form, timezone: e.target.value })}
            className={inputClass}
          />
          {browserTz && browserTz !== form.timezone && (
            <button
              type="button"
              onClick={() => setForm({ ...form, timezone: browserTz })}
              className="whitespace-nowrap px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-label font-bold text-on-surface cursor-pointer transition-colors"
            >
              Use {browserTz}
            </button>
          )}
        </div>
        <p className="text-[11px] text-on-surface-variant mt-1">Used for streaks and daily goals.</p>
      </div>

      {status.error && <p className="text-xs text-error font-medium">{status.error}</p>}
      {status.saved && (
        <p className="text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 font-medium">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>Preferences saved.</span>
        </p>
      )}

      <button
        type="submit"
        disabled={status.saving}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label text-xs font-bold shadow-sm transition-all duration-150 transform active:scale-95 disabled:opacity-50 cursor-pointer"
      >
        {status.saving && <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>}
        <span>Save Preferences</span>
      </button>
    </form>
  );
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState('study');
  const { theme, setTheme } = useTheme();

  const tabs = [
    { id: 'study', label: 'Study & Review', icon: 'school' },
    { id: 'appearance', label: 'Appearance', icon: 'palette' },
    { id: 'security', label: 'Security', icon: 'shield' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
  ];

  const themeOptions = [
    {
      id: 'light',
      label: 'Light (Sahara)',
      sub: 'Warm parchment & terracotta',
      icon: 'wb_sunny',
    },
    {
      id: 'dark',
      label: 'Dark (Obsidian)',
      sub: 'Deep dark & ember accents',
      icon: 'dark_mode',
    },
    {
      id: 'system',
      label: 'System',
      sub: 'Matches operating system setting',
      icon: 'settings_brightness',
    },
  ];

  return (
    <div className="py-6 space-y-8 max-w-5xl mx-auto font-body">
      {/* Header */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
          Settings
        </h1>
        <p className="font-body text-xs md:text-sm text-on-surface-variant mt-1">
          Manage your study preferences, appearance, and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <aside className="md:col-span-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-label font-bold transition-all cursor-pointer text-left ${
                activeTab === tab.id
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/20'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
              <span className="flex-1">{tab.label}</span>
              {activeTab === tab.id && <span className="material-symbols-outlined text-[18px]">chevron_right</span>}
            </button>
          ))}
        </aside>

        {/* Content Pane */}
        <div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-[0_2px_16px_rgba(58,48,42,0.04)] min-h-[400px]">
          {activeTab === 'study' && (
            <div className="space-y-6">
              <div className="border-b border-outline-variant/20 pb-4">
                <h2 className="font-headline text-xl font-bold text-on-surface">Study Preferences</h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  Daily review goal, new cards per day, and timezone.
                </p>
              </div>
              <StudySettings />
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="border-b border-outline-variant/20 pb-4">
                <h2 className="font-headline text-xl font-bold text-on-surface">Appearance</h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  Customize how the application looks. Changes are saved automatically.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setTheme(opt.id)}
                    className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[140px] ${
                      theme === opt.id
                        ? 'border-primary ring-2 ring-primary/30 bg-primary-fixed/20 shadow-sm'
                        : 'border-outline-variant/30 bg-surface-container-low hover:bg-surface-container-high'
                    }`}
                    type="button"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="material-symbols-outlined text-2xl text-primary">{opt.icon}</span>
                      {theme === opt.id && (
                        <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                      )}
                    </div>
                    <div>
                      <p className="font-headline text-base font-bold text-on-surface leading-snug">{opt.label}</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">{opt.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="border-b border-outline-variant/20 pb-4">
                <h2 className="font-headline text-xl font-bold text-on-surface">Security</h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  Manage your password and signed-in devices.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-label font-bold uppercase tracking-wider text-on-surface">
                  Change Password
                </h3>
                <ChangePasswordForm />
              </div>

              <SessionsCard />
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="border-b border-outline-variant/20 pb-4">
                <h2 className="font-headline text-xl font-bold text-on-surface">Notifications</h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  Email reminder preferences.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-center">
                <span className="material-symbols-outlined text-3xl text-outline mb-2">notifications_paused</span>
                <h4 className="font-headline text-lg font-bold text-on-surface">Study Reminders Coming Soon</h4>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto mt-1">
                  We don't send any notifications yet. Study reminders by email will be available in a future update.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
