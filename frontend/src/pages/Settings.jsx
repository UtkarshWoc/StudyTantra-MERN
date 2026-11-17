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
        You authenticate via Google SSO. To configure an optional academic password, visit{' '}
        <Link to="/forgot-password" className="text-primary font-bold hover:underline">
          Forgot Password
        </Link>{' '}
        to generate a secure recovery token.
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
          <span>Password updated. Other sessions were safely logged out.</span>
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
      <h3 className="font-headline text-lg font-bold text-on-surface">Active Academic Sessions</h3>
      <p className="text-xs text-on-surface-variant mb-4 mt-1">
        Revoke active authentication cookies and JWT tokens across all mobile and secondary desktop devices.
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
    targetRetention: 90,
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
    <form onSubmit={save} className="space-y-6 max-w-xl">
      {/* Target Retention Slider Section */}
      <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="font-label text-xs font-bold uppercase tracking-wider text-on-surface">
              Target Retention Rate (FSRS-4.5)
            </label>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              Empirical probability of recalling a card upon due date maturity.
            </p>
          </div>
          <div className="flex items-baseline gap-1 bg-surface-container-lowest px-3 py-1.5 rounded-xl shadow-sm border border-outline-variant/20">
            <span className="font-headline text-2xl font-bold text-primary">{form.targetRetention}</span>
            <span className="text-xs font-semibold text-primary font-label">%</span>
          </div>
        </div>

        <input
          type="range"
          min="80"
          max="97"
          value={form.targetRetention}
          onChange={(e) => setForm({ ...form, targetRetention: Number(e.target.value) })}
          className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
        />

        <div className="flex justify-between text-[10px] font-label font-medium text-on-surface-variant">
          <span>80% (Moderate load)</span>
          <span className="text-primary font-bold">90% (Empirically Optimal)</span>
          <span>97% (Strict mastery)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            New Cards Introduced / Day
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
        </div>
      </div>

      <div>
        <label htmlFor="pref-tz" className={labelClass}>
          Academic Timezone
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
        <p className="text-[11px] text-on-surface-variant mt-1">Controls streak roll-overs and daily retrieval resets.</p>
      </div>

      {status.error && <p className="text-xs text-error font-medium">{status.error}</p>}
      {status.saved && (
        <p className="text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 font-medium">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>Preferences successfully synced.</span>
        </p>
      )}

      <button
        type="submit"
        disabled={status.saving}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label text-xs font-bold shadow-sm transition-all duration-150 transform active:scale-95 disabled:opacity-50 cursor-pointer"
      >
        {status.saving && <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>}
        <span>Save Study Parameters</span>
      </button>
    </form>
  );
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState('study');
  const { theme, setTheme } = useTheme();

  const tabs = [
    { id: 'study', label: 'Spaced Repetition (FSRS)', icon: 'psychology' },
    { id: 'appearance', label: 'Appearance & Themes', icon: 'palette' },
    { id: 'security', label: 'Security & Sessions', icon: 'shield' },
    { id: 'notifications', label: 'Notifications & Alerts', icon: 'notifications' },
  ];

  const themeOptions = [
    {
      id: 'light',
      label: 'Sahara Parchment',
      sub: 'Warm #faf5ee, terracotta highlights',
      icon: 'wb_sunny',
    },
    {
      id: 'dark',
      label: 'Obsidian Nocturne',
      sub: 'Deep dark #19120c, ember accents',
      icon: 'dark_mode',
    },
    {
      id: 'system',
      label: 'Operating System',
      sub: 'Matches macOS / Windows appearance',
      icon: 'settings_brightness',
    },
  ];

  return (
    <div className="py-6 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-outline-variant/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">settings</span>
          </span>
          <span className="text-[11px] font-label font-bold uppercase tracking-widest text-primary">
            System Preferences
          </span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-bold text-on-surface tracking-tight">
          Settings &amp; Algorithm Tuning
        </h1>
        <p className="font-body text-sm text-on-surface-variant max-w-2xl mt-1.5">
          Configure FSRS spaced repetition coefficients, theme modes, authentication security, and study habits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="md:col-span-4 space-y-1.5">
          <span className="text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant px-3 mb-2 block">
            Preference Domains
          </span>
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
        <div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-[0_2px_16px_rgba(58,48,42,0.04)] min-h-[440px]">
          {activeTab === 'study' && (
            <div className="space-y-6">
              <div className="border-b border-outline-variant/20 pb-4">
                <span className="text-[10px] font-label font-bold uppercase tracking-wider text-primary">
                  Cognitive Parameters
                </span>
                <h2 className="font-headline text-2xl font-bold text-on-surface mt-0.5">Spaced Repetition &amp; FSRS</h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  Adjust retention targets, daily review volume, and study timezone.
                </p>
              </div>
              <StudySettings />
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="border-b border-outline-variant/20 pb-4">
                <span className="text-[10px] font-label font-bold uppercase tracking-wider text-primary">
                  Visual Palette
                </span>
                <h2 className="font-headline text-2xl font-bold text-on-surface mt-0.5">Appearance &amp; Study Themes</h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  Select your preferred ambient lighting. Changes sync instantly across the workspace.
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
                <span className="text-[10px] font-label font-bold uppercase tracking-wider text-primary">
                  Access &amp; Security
                </span>
                <h2 className="font-headline text-2xl font-bold text-on-surface mt-0.5">Password &amp; Sessions</h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  Manage your academic credentials and signed-in hardware.
                </p>
              </div>

              <div className="space-y-4">
                <ChangePasswordForm />
              </div>

              <SessionsCard />
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="border-b border-outline-variant/20 pb-4">
                <span className="text-[10px] font-label font-bold uppercase tracking-wider text-primary">
                  Alert Cadence
                </span>
                <h2 className="font-headline text-2xl font-bold text-on-surface mt-0.5">Study Reminders</h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  Manage review reminder emails and milestone countdowns.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-center">
                <span className="material-symbols-outlined text-3xl text-outline mb-2">mark_email_read</span>
                <h4 className="font-headline text-lg font-bold text-on-surface">Email Reminders Coming Soon</h4>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto mt-1">
                  StudyTantra will soon support automated morning digests for cards due in your current study timezone.
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
