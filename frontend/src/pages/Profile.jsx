import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { api, getErrorMessage } from '../lib/api';
import { Mail, Lock, Trash2, Loader2, BadgeCheck, AlertCircle } from 'lucide-react';

const inputClass = "w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-gray-800 dark:text-gray-200 shadow-inner";

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
    <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-8 border border-red-100 dark:border-red-900/30 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-bold text-red-800 dark:text-red-400 mb-1">Delete Account</h3>
          <p className="text-sm text-red-600/80 dark:text-red-500/80 font-medium">Permanently deletes your account, documents, flashcards, quizzes and chats. This cannot be undone.</p>
        </div>
        {!open && (
          <button onClick={() => setOpen(true)} className="px-6 py-3 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-600 dark:hover:bg-red-700 hover:text-white dark:hover:text-white transition-all shadow-sm flex items-center whitespace-nowrap cursor-pointer">
            <Trash2 size={18} className="mr-2" />
            Delete Account
          </button>
        )}
      </div>

      {open && (
        <form onSubmit={handleDelete} className="mt-6 space-y-3 max-w-md">
          {needsPassword && (
            <input type="password" autoComplete="current-password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          )}
          <input type="text" placeholder="Type DELETE to confirm" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} />
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={deleting || confirm !== 'DELETE' || (needsPassword && !password)} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2">
              {deleting && <Loader2 size={16} className="animate-spin" />}
              Permanently delete
            </button>
            <button type="button" onClick={() => { setOpen(false); setError(''); }} className="px-5 py-2.5 text-gray-600 dark:text-gray-300 font-semibold rounded-xl hover:bg-white/60 dark:hover:bg-gray-800 cursor-pointer">
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
    return <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"><BadgeCheck size={14} /> Email verified</p>;
  }

  return (
    <div className="mt-2 text-xs font-medium text-amber-600 dark:text-amber-400 flex flex-wrap items-center gap-2">
      <AlertCircle size={14} />
      {user?.pendingEmail ? `Confirm ${user.pendingEmail} to finish changing your email.` : 'Your email is not verified.'}
      {status === 'sent' ? <span className="text-emerald-600 dark:text-emerald-400">Link sent. Check your inbox.</span> : (
        <button onClick={resend} disabled={status === 'sending'} className="underline font-semibold cursor-pointer disabled:opacity-50">Resend link</button>
      )}
      {status && !['sent', 'sending'].includes(status) && <span className="text-red-500">{status}</span>}
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
      setSaveSuccess(res.data.message || 'Successfully saved!');
      setTimeout(() => setSaveSuccess(''), 6000);
    } else {
      setSaveError(res?.error || 'Failed to save changes.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8 pb-10">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage your personal information.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-6 transition-colors">
        <div className="h-20 w-20 rounded-full bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-3xl shadow-inner">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name || 'User'}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{user?.email || ''}</p>
          <EmailStatus />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Update your name and email.</p>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label htmlFor="profile-name" className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
              <input id="profile-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label htmlFor="profile-email" className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                  <Mail size={18} />
                </div>
                <input id="profile-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputClass} pl-11`} />
              </div>
            </div>
            {emailChanged && (
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="profile-current-password" className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Current password (required to change email)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                    <Lock size={18} />
                  </div>
                  <input id="profile-current-password" type="password" autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={`${inputClass} pl-11`} />
                </div>
              </div>
            )}
          </div>
          <div className="pt-4 flex justify-between items-center">
            <div className="flex flex-col">
              <span className={"text-sm font-medium text-emerald-600 transition-opacity duration-300 " + (saveSuccess ? "opacity-100" : "opacity-0")}>{saveSuccess || '\u00a0'}</span>
              {saveError && <span className="text-sm font-medium text-red-500">{saveError}</span>}
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving || (emailChanged && !currentPassword)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all hover:shadow-lg cursor-pointer flex items-center">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <DeleteAccount />
    </div>
  );
};

export default Profile;
