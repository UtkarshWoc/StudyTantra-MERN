import React, { useState, useEffect } from 'react';
import { Folder, Layers, Sparkles, UploadCloud, Loader2, FileText, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ metrics: { totalDocuments: 0, totalFlashcards: 0, totalQuizzes: 0, averageScore: 0 }, recentActivity: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user) return;
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard`, { headers: { Authorization: `Bearer ${user.token}` } });
        if (data.metrics) setStats(data);
      } catch (e) { console.error('Dashboard error', e); }
      finally { setLoading(false); }
    };
    fetchDashboard();
  }, [user]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 text-slate-500">
      <Loader2 className="animate-spin mb-4 text-amber-500" size={36} />
      <p className="font-medium">Loading overview...</p>
    </div>
  );

  const { metrics, recentActivity } = stats;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e293b] to-[#0b1120] border border-[#334155]/50 shadow-2xl shadow-black/40 p-8 md:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <p className="text-amber-400 text-xs font-extrabold uppercase tracking-[0.2em] mb-3">Welcome back</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-50 mb-3 leading-tight">Hello, {user?.name?.split(' ')[0] || 'Learner'}.</h2>
          <p className="text-slate-400 text-base md:text-lg font-light leading-relaxed mb-6">Your study materials are ready. Continue where you left off, or upload new content to generate flashcards and quizzes automatically.</p>
          <button onClick={() => navigate('/documents')} className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-[#0b1120] font-extrabold px-6 py-3 rounded-xl shadow-lg shadow-amber-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"><UploadCloud size={18} /> Open Library</button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: 'Documents', value: metrics.totalDocuments, icon: Folder, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Flashcards', value: metrics.totalFlashcards, icon: Layers, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Avg Quiz Score', value: `${metrics.averageScore}%`, icon: Sparkles, color: 'text-violet-400', bg: 'bg-violet-500/10' },
        ].map(m => (
          <div key={m.label} className="relative overflow-hidden rounded-2xl bg-[#111827] border border-[#334155]/50 p-6 shadow-xl shadow-black/20 transition-transform hover:-translate-y-0.5">
            <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-30 ${m.bg} blur-2xl pointer-events-none`} />
            <div className="flex items-start gap-4 relative z-10">
              <div className={`p-3 rounded-xl ${m.bg} ${m.color} shadow-inner`}><m.icon size={24} strokeWidth={1.8} /></div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-1">{m.label}</p>
                <p className="text-3xl font-extrabold text-slate-50 tracking-tight">{m.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section className="lg:col-span-2 rounded-3xl bg-[#111827] border border-[#334155]/50 shadow-xl shadow-black/20 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-extrabold text-slate-100 tracking-tight">Recent Activity</h3>
            <button onClick={() => navigate('/documents')} className="text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer">View Library <ArrowUpRight size={14} /></button>
          </div>
          {recentActivity.length === 0 ? (
            <div className="rounded-2xl bg-[#0b1120] border border-dashed border-[#334155]/60 p-10 text-center flex flex-col items-center min-h-[260px] justify-center">
              <div className="p-4 rounded-full bg-[#1e293b] text-slate-500 mb-4"><Layers size={28} /></div>
              <h4 className="text-slate-200 font-bold mb-1">No recent activity</h4>
              <p className="text-sm text-slate-500 max-w-xs">Upload a document to begin generating study materials.</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#334155]/30">
              {recentActivity.map(doc => (
                <li key={doc._id} className="py-4 flex items-center justify-between hover:bg-white/[0.03] rounded-xl px-2 -mx-2 transition-colors cursor-pointer" onClick={() => navigate(`/documents/${doc._id}`)}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0"><FileText size={18} strokeWidth={1.8} /></div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-100 truncate">{doc.title}</p>
                      <p className="text-[11px] text-slate-500">Uploaded {new Date(doc.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-[#1e293b] px-2.5 py-1 rounded-md border border-[#334155]/30 shrink-0">Open</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="space-y-5">
          <section className="rounded-3xl bg-[#111827] border border-[#334155]/50 shadow-xl shadow-black/20 p-6">
            <h3 className="text-lg font-extrabold text-slate-100 tracking-tight mb-5">Learning Goals</h3>
            {[
              { label: 'Daily Flashcards', current: 0, target: 25 },
              { label: 'Course Completion', current: 0, target: 100 },
            ].map(g => (
              <div key={g.label} className="mb-5 last:mb-0">
                <div className="flex justify-between text-sm mb-2"><span className="text-slate-300 font-medium">{g.label}</span><span className="font-extrabold text-amber-400">{g.current}/{g.target}</span></div>
                <div className="w-full bg-[#0b1120] rounded-full h-2 overflow-hidden"><div className="bg-gradient-to-r from-amber-500 to-amber-300 h-2 rounded-full" style={{ width: `${(g.current/g.target)*100}%` }} /></div>
              </div>
            ))}
          </section>

          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-900 via-[#78350f] to-[#451a03] p-6 text-white shadow-2xl shadow-amber-950/30">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400 rounded-full opacity-10 blur-3xl pointer-events-none" />
            <h3 className="text-xl font-extrabold mb-2 relative z-10">Upgrade to Pro</h3>
            <p className="text-amber-100/80 text-sm leading-relaxed mb-5 relative z-10">Unlock unlimited AI summaries, advanced quizzes, and priority processing.</p>
            <button className="relative z-10 bg-white text-[#451a03] font-extrabold py-2.5 px-5 rounded-xl text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer">Upgrade Now</button>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
