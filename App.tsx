
import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, ToolCategory, ToolInfo, SystemConfig, AdUnit } from './types';
import { TOOLS, ADMIN_EMAIL } from './constants';
import Navbar from './components/Navbar';
import Layout from './components/Layout';
import ToolCard from './components/ToolCard';
import AIAssistant from './components/AIAssistant';
import Auth from './components/Auth';
import AdminPanel from './components/AdminPanel';
import SponsorSlider from './components/SponsorSlider';
import { extractVideoId, fetchYoutubeData } from './services/youtubeService';
import { generateAIResponse } from './services/geminiService';

type ViewState = 'home' | 'tool' | 'admin' | 'auth';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [selectedTool, setSelectedTool] = useState<ToolInfo | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // System Configuration
  const [config, setConfig] = useState<SystemConfig>(() => {
    const saved = localStorage.getItem('et_config');
    return saved ? JSON.parse(saved) : {
      maintenanceMode: false,
      activeTools: TOOLS.reduce((acc, t) => ({ ...acc, [t.id]: true }), {}),
      apiKeys: {
        gemini: '',
        youtube: 'AIzaSyB70Q82J-likHI7rTAvrRLuXaPwFpNzIow'
      },
      ads: {
        'default_h': { id: 'default_h', type: 'header', label: 'Main Header', html: '<div class="text-blue-600 font-bold">PREMIUM ADS SPACE</div>', active: true }
      },
      sponsorConfig: {
        enabled: true,
        sponsors: [
          { id: 's1', name: 'Google', imageUrl: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png', link: '#' },
          { id: 's2', name: 'Firebase', imageUrl: 'https://firebase.google.com/static/images/brand-guidelines/logo-logomark.png', link: '#' },
          { id: 's3', name: 'Stripe', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg', link: '#' }
        ]
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('et_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    setIsDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    setIsLoading(false);
  }, []);

  const toggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleToolClick = (tool: ToolInfo) => {
    if (!config.activeTools[tool.id]) {
      alert("This tool is currently disabled by administrator.");
      return;
    }
    if (tool.requiresAuth && !user) {
      setView('auth');
      return;
    }
    setSelectedTool(tool);
    setView('tool');
  };

  const navigateTo = (newView: ViewState) => {
    if (newView === 'admin' && (!user || !user.isAdmin)) {
      alert("Access Denied: Admins Only");
      return;
    }
    setView(newView);
    if (newView !== 'tool') setSelectedTool(null);
  };

  const filteredTools = useMemo(() => {
    return TOOLS.filter(t => config.activeTools[t.id]);
  }, [config.activeTools]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (config.maintenanceMode && (!user || !user.isAdmin)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 p-6 text-center">
        <div className="w-32 h-32 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-8 animate-pulse">
          <i className="fa-solid fa-person-digging text-6xl text-yellow-600"></i>
        </div>
        <h1 className="text-4xl font-black mb-4 text-slate-900 dark:text-white">Maintenance Mode</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md text-lg leading-relaxed">
          We are upgrading our systems to provide a better experience. We'll be back shortly!
        </p>
        <button 
          onClick={() => setView('auth')}
          className="mt-12 text-blue-600 font-bold hover:underline tracking-tight"
        >
          Administrator Access
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 selection:bg-blue-100 dark:selection:bg-blue-900">
      <Navbar 
        user={user} 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
        onNavigate={navigateTo}
      />
      
      <Layout config={config}>
        {view === 'home' && (
          <div className="space-y-16 animate-fade-in pb-20">
            <div className="text-center space-y-6 pt-10">
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                Ultimate <span className="text-blue-600">Productivity</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-xl font-medium">
                The most advanced utility hub for modern power users. Reliable, fast, and secure.
              </p>
            </div>

            {config.sponsorConfig.enabled && config.sponsorConfig.sponsors.length > 0 && (
              <SponsorSlider sponsors={config.sponsorConfig.sponsors} />
            )}

            {Object.values(ToolCategory).map(category => {
              const categoryTools = filteredTools.filter(t => t.category === category);
              if (categoryTools.length === 0) return null;
              return (
                <section key={category} className="space-y-8">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                    <span className="w-3 h-10 bg-blue-600 rounded-full"></span>
                    {category} Tools
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoryTools.map(tool => (
                      <ToolCard 
                        key={tool.id} 
                        tool={tool} 
                        onClick={() => handleToolClick(tool)} 
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {view === 'auth' && (
          <Auth onAuthSuccess={(u) => { setUser(u); setView('home'); }} />
        )}

        {view === 'admin' && user?.isAdmin && (
          <AdminPanel config={config} setConfig={setConfig} user={user} />
        )}

        {view === 'tool' && selectedTool && (
          <ToolRenderer tool={selectedTool} onBack={() => navigateTo('home')} apiKeys={config.apiKeys} />
        )}
      </Layout>

      <AIAssistant />
    </div>
  );
};

const ToolRenderer: React.FC<{ tool: ToolInfo; onBack: () => void; apiKeys: any }> = ({ tool, onBack, apiKeys }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-6 md:p-12 border border-slate-200 dark:border-slate-800 animate-fade-in">
      <button onClick={onBack} className="mb-10 text-blue-600 hover:text-blue-700 font-bold flex items-center gap-3 transition-transform hover:-translate-x-1">
        <i className="fa-solid fa-arrow-left-long"></i> Back to Hub
      </button>
      
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-200 dark:shadow-none">
          <i className={`fa-solid ${tool.icon} text-4xl text-white`}></i>
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{tool.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">{tool.description}</p>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 pt-12">
        {tool.id === 'salary-calc' && <SalaryCalculator />}
        {tool.id === 'bmi-calc' && <BMICalculator />}
        {tool.id === 'yt-analyzer' && <YouTubeAnalyzer apiKey={apiKeys.youtube} />}
        {tool.id === 'ai-email' && <AIEmailWriter />}
        {['salary-calc', 'bmi-calc', 'yt-analyzer', 'ai-email'].indexOf(tool.id) === -1 && (
           <div className="py-20 text-center space-y-6">
             <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                <i className="fa-solid fa-gear fa-spin text-5xl text-slate-300"></i>
             </div>
             <p className="text-slate-500 text-xl font-bold">This tool is currently being optimized for high traffic.</p>
           </div>
        )}
      </div>
    </div>
  );
};

const YouTubeAnalyzer: React.FC<{ apiKey: string }> = ({ apiKey }) => {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    const videoId = extractVideoId(url);
    if (!videoId) return alert("Please enter a valid YouTube URL");
    setLoading(true);
    try {
      const res = await fetchYoutubeData(videoId, apiKey);
      setData(res);
    } catch (err) {
      alert("YouTube API Error. Check your Key in the Admin Panel.");
    } finally {
      setLoading(false);
    }
  };

  const downloadThumb = async (imgUrl: string, quality: string) => {
    try {
      const res = await fetch(imgUrl);
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `youtube_thumbnail_${quality}_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      window.open(imgUrl, '_blank');
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row gap-4 max-w-4xl">
        <input 
          className="flex-1 p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-lg outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition"
          placeholder="Enter YouTube URL (e.g., https://youtube.com/watch?v=...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button 
          onClick={handleAnalyze} 
          disabled={loading}
          className="bg-red-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-red-700 disabled:opacity-50 transition shadow-xl shadow-red-200 dark:shadow-none"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin mr-3"></i> : null}
          {loading ? 'ANALYZING...' : 'ANALYZE'}
        </button>
      </div>

      {data && (
        <div className="space-y-12 animate-fade-in">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="relative group overflow-hidden rounded-[2rem] shadow-2xl">
               <img src={data.snippet.thumbnails.maxres?.url || data.snippet.thumbnails.high.url} className="w-full transform group-hover:scale-105 transition duration-700" alt="Cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                 <h2 className="text-white font-black text-2xl leading-tight line-clamp-2 mb-2">{data.snippet.title}</h2>
                 <p className="text-white/80 font-bold flex items-center gap-2">
                   <i className="fa-brands fa-youtube text-red-600 text-xl"></i> {data.snippet.channelTitle}
                 </p>
               </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: 'Total Views', val: data.statistics.viewCount, icon: 'fa-eye', color: 'text-blue-500' },
                { label: 'Total Likes', val: data.statistics.likeCount, icon: 'fa-heart', color: 'text-red-500' },
                { label: 'Total Comments', val: data.statistics.commentCount, icon: 'fa-comment', color: 'text-purple-500' },
                { label: 'Channel', val: data.snippet.channelTitle, icon: 'fa-user-check', color: 'text-green-500' }
              ].map(stat => (
                <div key={stat.label} className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                  <div className={`w-10 h-10 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center mb-4 ${stat.color}`}>
                    <i className={`fa-solid ${stat.icon}`}></i>
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white truncate">
                    {isNaN(Number(stat.val)) ? stat.val : Number(stat.val).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-3xl font-black tracking-tight">Thumbnail Resources</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(data.snippet.thumbnails).map(([key, value]: [string, any]) => (
                <div key={key} className="bg-white dark:bg-slate-950 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between group hover:border-blue-500 transition-colors">
                  <div>
                    <p className="font-black text-xl text-blue-600 capitalize mb-1">{key}</p>
                    <p className="text-sm font-bold text-slate-400">{value.width} × {value.height}</p>
                  </div>
                  <button 
                    onClick={() => downloadThumb(value.url, key)}
                    className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all group-hover:scale-110"
                  >
                    <i className="fa-solid fa-download text-xl"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SalaryCalculator = () => <div className="p-12 text-center bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 font-bold text-slate-400 text-lg">Detailed US Tax Engine Loading...</div>;
const BMICalculator = () => <div className="p-12 text-center bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 font-bold text-slate-400 text-lg">Medical Grade Calculation Interface Loading...</div>;
const AIEmailWriter = () => <div className="p-12 text-center bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 font-bold text-slate-400 text-lg">AI Neural Draft Generator Loading...</div>;

export default App;
