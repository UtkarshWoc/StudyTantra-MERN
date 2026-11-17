import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { api, getErrorMessage } from '../lib/api';

const inputClass =
  'w-full px-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all font-body text-on-surface';
const labelClass = 'block text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant mb-1.5';

const DeleteAccount = () => {
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const needsPassword = user?.hasPassword;
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleting(true);
    setError('');
    const res = await deleteAccount(needsPassword ? password : undefined, confirm);
    if (res.success) {
      navigate('/login');
    } else {
      setError(res.error);
      setDeleting(false);
    }
  };

  return (
    <div className="bg-tertiary-fixed/20 border border-tertiary/30 rounded-3xl p-6 md:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-tertiary text-[20px]">warning</span>
            <h3 className="font-headline text-xl font-bold text-tertiary">Danger Zone: Terminate Account</h3>
          </div>
          <p className="text-xs text-on-surface-variant max-w-xl leading-relaxed">
            Permanently erases your scholar profile, synthesized flashcards, quiz attempts, and uploaded PDF course texts. This action cannot be reversed.
          </p>
        </div>

        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="px-5 py-2.5 bg-surface-container-lowest border border-tertiary/40 text-tertiary hover:bg-tertiary hover:text-on-tertiary font-label text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">delete_forever</span>
            <span>Delete Account</span>
          </button>
        )}
      </div>

      {open && (
        <form onSubmit={handleDelete} className="mt-6 space-y-4 max-w-md pt-4 border-t border-tertiary/20">
          {needsPassword && (
            <div>
              <label className={labelClass}>Confirm with Password</label>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Your current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>
          )}
          <div>
            <label className={labelClass}>Confirmation Phrase</label>
            <input
              type="text"
              placeholder="Type DELETE to confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClass}
            />
          </div>

          {error && <p className="text-xs text-error font-medium">{error}</p>}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={deleting || confirm !== 'DELETE' || (needsPassword && !password)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-tertiary hover:bg-tertiary-container text-on-tertiary font-label text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {deleting && <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>}
              <span>Permanently Delete</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setError('');
              }}
              className="px-4 py-2.5 text-on-surface-variant hover:text-on-surface text-xs font-label font-bold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const EmailStatus = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState('');

  const resend = async () => {
    setStatus('sending');
    try {
      await api.post('/auth/resend-verification');
      setStatus('sent');
    } catch (error) {
      setStatus(getErrorMessage(error));
    }
  };

  if (user?.emailVerified && !user?.pendingEmail) {
    return (
      <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-label font-semibold text-emerald-700 dark:text-emerald-300">
        <span className="material-symbols-outlined text-[16px]">verified</span>
        <span>Verified Academic Account</span>
      </p>
    );
  }

  return (
    <div className="mt-2 text-xs font-label font-medium text-primary flex flex-wrap items-center gap-2">
      <span className="material-symbols-outlined text-[16px]">priority_high</span>
      <span>{user?.pendingEmail ? `Confirm ${user.pendingEmail} to finish changing your email.` : 'Your email is not verified.'}</span>
      {status === 'sent' ? (
        <span className="text-emerald-700 dark:text-emerald-300 font-bold">Verification link sent!</span>
      ) : (
        <button
          onClick={resend}
          disabled={status === 'sending'}
          className="underline font-bold hover:text-primary-container cursor-pointer disabled:opacity-50"
          type="button"
        >
          Resend link
        </button>
      )}
      {status && !['sent', 'sending'].includes(status) && <span className="text-error">{status}</span>}
    </div>
  );
};

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  const emailChanged = email.trim().toLowerCase() !== (user?.email || '').toLowerCase();

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError('');
    const res = await updateProfile(name, email, emailChanged ? currentPassword : undefined);
    setIsSaving(false);
    if (res?.success) {
      setCurrentPassword('');
      setEmail(res.data.user.email);
      setSaveSuccess(res.data.message || 'Profile saved successfully!');
      setTimeout(() => setSaveSuccess(''), 6000);
    } else {
      setSaveError(res?.error || 'Failed to save changes.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="pb-4 border-b border-outline-variant/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </span>
          <span className="text-[11px] font-label font-bold uppercase tracking-widest text-primary">
            Academic Identity
          </span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-bold text-on-surface tracking-tight">
          Scholar Profile
        </h1>
        <p className="font-body text-sm text-on-surface-variant max-w-2xl mt-1.5">
          Manage your personal academic identity, linked institutional email address, and account safety.
        </p>
      </div>

      {/* Identity Hero Card */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-[0_2px_16px_rgba(58,48,42,0.04)] flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="h-20 w-20 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-headline text-3xl font-bold shadow-md shrink-0">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-headline text-2xl font-bold text-on-surface">{user?.name || 'Scholar'}</h2>
            <span className="px-2 py-0.5 rounded-md bg-primary-fixed text-on-primary-fixed text-[10px] font-label font-bold uppercase tracking-wider">
              Level 4 Scholar
            </span>
          </div>
          <p className="text-xs font-label text-on-surface-variant mt-0.5">{user?.email || ''}</p>
          <EmailStatus />
        </div>
      </div>

      {/* Personal Info Form */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-[0_2px_16px_rgba(58,48,42,0.04)] overflow-hidden">
        <div className="p-6 md:p-8 border-b border-outline-variant/20">
          <h3 className="font-headline text-xl font-bold text-on-surface">Personal Information</h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Update your display name and academic communication address.
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="profile-name" className={labelClass}>
                Full Name
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="profile-email" className={labelClass}>
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined text-[18px] text-outline absolute left-3.5 top-3.5 pointer-events-none">
                  mail
                </span>
                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            {emailChanged && (
              <div className="md:col-span-2">
                <label htmlFor="profile-current-password" className={labelClass}>
                  Current Password (Required when changing email)
                </label>
                <input
                  id="profile-current-password"
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}
          </div>

          <div className="pt-4 flex flex-wrap justify-between items-center gap-4">
            <div>
              {saveSuccess && (
                <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  {saveSuccess}
                </span>
              )}
              {saveError && <span className="text-xs text-error font-medium">{saveError}</span>}
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving || (emailChanged && !currentPassword)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label text-xs font-bold shadow-sm transition-all duration-150 transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              type="button"
            >
              {isSaving && <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>}
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <DeleteAccount />
    </div>
  );
};

export default Profile;
