import React, { useState, useEffect } from 'react';
import { Folder, Layers, Sparkles, UploadCloud, Rocket, Loader2, FileText } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ 
    metrics: { totalDocuments: 0, totalFlashcards: 0, totalQuizzes: 0, averageScore: 0 }, 
    recentActivity: [] 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user) return;
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (data.metrics) setStats(data);
      } catch (error) {
        console.error("Dashboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  if (loading) {
     return (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
           <Loader2 className="animate-spin mb-4" size={48} />
           <p className="font-medium">Loading Dashboard...</p>
        </div>
     );
  }

  const { metrics, recentActivity } = stats;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl p-6 flex items-center justify-between border border-indigo-100 dark:border-indigo-800 transition-colors">
        <div>
          <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-2">Welcome back, {user?.name.split(' ')[0]}!</h2>
          <p className="text-indigo-700 dark:text-indigo-300">Ready to continue your learning journey?</p>
        </div>
        <button 
          onClick={() => navigate('/documents')}
          className="bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium flex items-center shadow-sm transition-colors cursor-pointer"
        >
          <UploadCloud size={18} className="mr-2" />
          Go to Library
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4 transition-colors">
          <div className="bg-blue-50 dark:bg-blue-900/40 p-4 rounded-xl text-blue-600 dark:text-blue-400">
            <Folder size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Documents</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.totalDocuments}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4 transition-colors">
          <div className="bg-indigo-50 dark:bg-indigo-900/40 p-4 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Layers size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Flashcards</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.totalFlashcards}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4 transition-colors">
          <div className="bg-purple-50 dark:bg-purple-900/40 p-4 rounded-xl text-purple-600 dark:text-purple-400">
            <Sparkles size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Avg Quiz Score</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.averageScore}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
            <button onClick={() => navigate('/documents')} className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-800 dark:hover:text-indigo-300 cursor-pointer">View Library</button>
          </div>
          
          {recentActivity.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 flex flex-col items-center justify-center text-center min-h-[300px] transition-colors">
               <div className="bg-gray-50 dark:bg-gray-700/50 w-20 h-20 rounded-full flex items-center justify-center mb-4 text-gray-400 dark:text-gray-500">
                 <Layers size={32} />
               </div>
               <h4 className="text-gray-900 dark:text-gray-100 font-semibold mb-2">No recent activity</h4>
               <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">Upload a new document to generate flashcards and quizzes, and your activity will appear here.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
               <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                  {recentActivity.map(doc => (
                    <li key={doc._id} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={() => navigate(`/documents/${doc._id}`)}>
                      <div className="flex items-center">
                         <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-xl text-indigo-500 mr-4">
                           <FileText size={20} />
                         </div>
                         <div>
                            <p className="font-bold text-gray-900 dark:text-white">{doc.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Uploaded {new Date(doc.createdAt).toLocaleDateString()}</p>
                         </div>
                      </div>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300">Open Document</span>
                    </li>
                  ))}
               </ul>
            </div>
          )}
        </div>

        {/* Learning Goals & Pro Plan */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Learning Goals</h3>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Daily Flashcards</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">0/25</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Course Completion</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">0%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-md">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Pro Plan Features</h3>
              <p className="text-indigo-100 dark:text-indigo-200 text-sm mb-6 leading-relaxed">Unlock unlimited AI document summaries and personalized quizzes.</p>
              <button className="bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 font-bold py-2 px-4 rounded-lg text-sm hover:shadow-lg transition-shadow cursor-pointer">
                Upgrade Now
              </button>
            </div>
            {/* Decorative Icon */}
            <Rocket size={120} className="absolute -bottom-6 -right-6 text-white opacity-10 transform rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
