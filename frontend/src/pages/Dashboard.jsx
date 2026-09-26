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

  if (loading) return (<div className="flex flex-col items-center justify-center py-16 text-slate-500"><Loader2 className="animate-spin mb-4 text-amber-500" size={36} /><p className="font-medium">Loading overview...</p></div>);

  const { metrics, recentActivity } = stats;

  return (
    <div className="space-y-6">
      {/* Compact welcome - no hero banner */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">Dashboard</h2>
        <button onClick={() => navigate('/documents')} className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-[#0b1120] text-xs font-extrabold px-3 py-2 rounded-lg shadow-md transition-all cursor-pointer"><UploadCloud size={14} /> Library</button>
      </div>

      {/* Compact stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Documents', value: metrics.totalDocuments, icon: Folder, bg: 'bg-amber-500/10', text: 'text-amber-400' },
          { label: 'Flashcards', value: metrics.totalFlashcards, icon: Layers, bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
          { label: 'Avg Score', value: `${metrics.averageScore}%`, icon: Sparkles, bg: 'bg-violet-500/10', text: 'text-violet-400' },
        ].map(m => (
          <div key={m.label} className="bg-[#111827] border border-[#334155]/50 rounded-2xl p-4 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${m.bg} ${m.text}`}><m.icon size={20} strokeWidth={1.8} /></div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">{m.label}</p>
                <p className="text-xl font-extrabold text-slate-50">{m.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity only — no goals, no upgrade card */}
      <section className="bg-[#111827] border border-[#334155]/50 rounded-3xl shadow-xl shadow-black/20 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-extrabold text-slate-100 tracking-tight">Recent Activity</h3>
          <button onClick={() => navigate('/documents')} className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer">View Library</button>
        </div>
        {recentActivity.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">No recent activity. Upload a document to start.</div>
        ) : (
          <ul className="divide-y divide-[#334155]/30">
            {recentActivity.map(doc => (
              <li key={doc._id} className="py-3 flex items-center justify-between hover:bg-white/[0.03] rounded-xl px-2 cursor-pointer transition-colors" onClick={() => navigate(`/documents/${doc._id}`)}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><FileText size={16} /></div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-100 truncate">{doc.title}</p>
                    <p className="text-[11px] text-slate-500">{new Date(doc.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-400 bg-[#1e293b] px-2 py-0.5 rounded-md border border-[#334155]/30">Open</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
