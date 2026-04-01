import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, Mail, Shield, Bell, CreditCard, LogOut, Trash2, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError('');
    const res = await updateProfile(name, email);
    setIsSaving(false);
    if (res?.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setSaveError(res?.error || 'Failed to save changes.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8 pb-10">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Account Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage your profile, preferences, and subscription.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {[
              { id: 'general', label: 'General', icon: <Shield size={18} /> },
              { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
              { id: 'billing', label: 'Billing & Plan', icon: <CreditCard size={18} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap outline-none cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === 'general' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
              {/* Avatar Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center sm:items-start gap-6 transition-colors">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-full bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-3xl shadow-inner border-4 border-white dark:border-gray-800">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-md hover:bg-indigo-700 transition-all cursor-pointer opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
                    <Camera size={14} />
                  </button>
                </div>
                <div className="text-center sm:text-left flex-1 mt-2 sm:mt-0">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name || 'User'}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{user?.email || ''}</p>
                  <div className="mt-5 flex flex-wrap justify-center sm:justify-start gap-3">
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300 text-gray-700 hover:text-indigo-700 dark:hover:text-indigo-400 text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer">
                      Change Avatar
                    </button>
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-500/50 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer">
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Personal Info Form */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Update your personal details here.</p>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-gray-800 dark:text-gray-200 shadow-inner"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                          <Mail size={18} />
                        </div>
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-gray-800 dark:text-gray-200 shadow-inner"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className={"text-sm font-medium text-emerald-600 transition-opacity duration-300 " + (saveSuccess ? "opacity-100" : "opacity-0")}>Successfully saved!</span>
                      {saveError && <span className="text-sm font-medium text-red-500">{saveError}</span>}
                    </div>
                    <button 
                      onClick={handleSave} 
                      disabled={isSaving}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-75 disabled:cursor-wait text-white font-bold rounded-xl shadow-md transition-all hover:shadow-lg cursor-pointer flex items-center">
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-300 transition-colors">
               <div className="bg-indigo-50 dark:bg-indigo-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-indigo-500 dark:text-indigo-400 mb-4">
                 <Bell size={28} />
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Notification Settings</h3>
               <p className="text-gray-500 dark:text-gray-400 font-medium">Notification preferences will appear here.</p>
             </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 transition-colors">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-800">
                <h3 className="text-lg font-bold text-indigo-950 dark:text-indigo-100">Current Plan</h3>
                <p className="text-sm text-indigo-700/70 dark:text-indigo-300 font-medium mt-1">Manage your subscription and billing details.</p>
              </div>
              <div className="p-8">
                <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-900/50 rounded-2xl p-6 border-2 border-dashed border-indigo-100 dark:border-indigo-900/50 mb-8 shadow-sm">
                  <div className="text-center sm:text-left">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 mb-3">Free Tier</span>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white">$0 <span className="text-base font-medium text-gray-500 dark:text-gray-400">/ month</span></h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Basic limits on AI usage and storage.</p>
                  </div>
                  <button className="mt-6 sm:mt-0 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg w-full sm:w-auto cursor-pointer">
                    Upgrade to Pro
                  </button>
                </div>
                
                <h4 className="font-bold text-gray-900 dark:text-white mb-5">Pro Plan includes:</h4>
                <ul className="space-y-4 mb-4">
                  {['Unlimited AI Document Summaries & Chat', 'Advanced Quiz & Flashcard Generation', 'Priority Cloud Processing', 'Early Access to New Features'].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 size={20} className="text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          <div className="mt-12">
            <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-8 border border-red-100 dark:border-red-900/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-red-800 dark:text-red-400 mb-1">Delete Account</h3>
                <p className="text-sm text-red-600/80 dark:text-red-500/80 font-medium">Once you delete your account, there is no going back. Please be certain.</p>
              </div>
              <button className="px-6 py-3 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-600 dark:hover:bg-red-700 hover:text-white dark:hover:text-white transition-all shadow-sm flex items-center whitespace-nowrap cursor-pointer">
                <Trash2 size={18} className="mr-2" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default Profile;
