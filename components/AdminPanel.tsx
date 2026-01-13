
import React, { useState, useEffect } from 'react';
import { UserProfile, SystemConfig, AdUnit, Sponsor } from '../types';
import { TOOLS } from '../constants';

interface AdminPanelProps {
  config: SystemConfig;
  setConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
  user: UserProfile;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ config, setConfig, user }) => {
  const [activeTab, setActiveTab] = useState<'system' | 'ads' | 'tools' | 'users' | 'sponsors'>('system');
  const [editingAd, setEditingAd] = useState<Partial<AdUnit> | null>(null);
  const [editingSponsor, setEditingSponsor] = useState<Partial<Sponsor> | null>(null);
  const [visitors, setVisitors] = useState(42);

  // Simulated live visitor tracker
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitors(v => Math.max(10, v + (Math.random() > 0.5 ? 1 : -1)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleMaintenance = () => {
    setConfig(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }));
  };

  const toggleTool = (id: string) => {
    setConfig(prev => ({
      ...prev,
      activeTools: { ...prev.activeTools, [id]: !prev.activeTools[id] }
    }));
  };

  const updateApiKey = (type: 'gemini' | 'youtube', val: string) => {
    setConfig(prev => ({
      ...prev,
      apiKeys: { ...prev.apiKeys, [type]: val }
    }));
  };

  const saveAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAd || !editingAd.id) return;
    setConfig(prev => ({
      ...prev,
      ads: { ...prev.ads, [editingAd.id!]: editingAd as AdUnit }
    }));
    setEditingAd(null);
  };

  const deleteAd = (id: string) => {
    const newAds = { ...config.ads };
    delete newAds[id];
    setConfig(prev => ({ ...prev, ads: newAds }));
  };

  const saveSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSponsor || !editingSponsor.id) return;
    const existingIdx = config.sponsorConfig.sponsors.findIndex(s => s.id === editingSponsor.id);
    let newSponsors = [...config.sponsorConfig.sponsors];
    
    if (existingIdx > -1) {
      newSponsors[existingIdx] = editingSponsor as Sponsor;
    } else {
      newSponsors.push(editingSponsor as Sponsor);
    }

    setConfig(prev => ({
      ...prev,
      sponsorConfig: { ...prev.sponsorConfig, sponsors: newSponsors }
    }));
    setEditingSponsor(null);
  };

  const deleteSponsor = (id: string) => {
    setConfig(prev => ({
      ...prev,
      sponsorConfig: {
        ...prev.sponsorConfig,
        sponsors: prev.sponsorConfig.sponsors.filter(s => s.id !== id)
      }
    }));
  };

  const toggleSponsorSlider = () => {
    setConfig(prev => ({
      ...prev,
      sponsorConfig: { ...prev.sponsorConfig, enabled: !prev.sponsorConfig.enabled }
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-fade-in mb-20">
      <div className="flex flex-col lg:flex-row min-h-[800px]">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 bg-slate-50 dark:bg-slate-950 p-10 border-r border-slate-200 dark:border-slate-800">
          <div className="mb-12">
            <h2 className="text-3xl font-black dark:text-white tracking-tighter">Admin Vault</h2>
            <div className="flex items-center gap-3 mt-4 bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
               <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-sm font-black text-slate-700 dark:text-slate-300 tracking-tight">{visitors} Active Visitors</span>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { id: 'system', icon: 'fa-microchip', label: 'Core Controls' },
              { id: 'ads', icon: 'fa-rectangle-ad', label: 'Ad Monetization' },
              { id: 'sponsors', icon: 'fa-star', label: 'Sponsor Slider' },
              { id: 'tools', icon: 'fa-sliders', label: 'Tool Management' },
              { id: 'users', icon: 'fa-user-group', label: 'User Database' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-4 px-6 py-5 rounded-[1.5rem] font-black text-sm transition-all transform active:scale-95 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 dark:shadow-none' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <i className={`fa-solid ${tab.icon} text-lg`}></i> {tab.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-10 lg:p-16">
          {activeTab === 'system' && (
            <div className="space-y-12 animate-fade-in">
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Maintenance Override</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mt-2">Immediately disable all tools and public access.</p>
                </div>
                <button 
                  onClick={toggleMaintenance}
                  className={`w-full md:w-auto px-12 py-5 rounded-2xl font-black text-lg transition shadow-xl ${config.maintenanceMode ? 'bg-red-600 text-white shadow-red-200' : 'bg-green-600 text-white shadow-green-200'}`}
                >
                  {config.maintenanceMode ? 'DEACTIVATE' : 'ACTIVATE'}
                </button>
              </div>

              <div className="space-y-8">
                <h4 className="text-2xl font-black tracking-tight border-b dark:border-slate-800 pb-4">API Configuration</h4>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">YouTube Data Key (V3)</label>
                     <input 
                       type="text" 
                       className="w-full p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-sm focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition outline-none"
                       value={config.apiKeys.youtube}
                       onChange={(e) => updateApiKey('youtube', e.target.value)}
                     />
                  </div>
                  <div className="space-y-3">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Google Gemini API Key</label>
                     <input 
                       type="password" 
                       className="w-full p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-sm focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition outline-none"
                       value={config.apiKeys.gemini}
                       onChange={(e) => updateApiKey('gemini', e.target.value)}
                     />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ads' && (
            <div className="space-y-10 animate-fade-in">
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-black tracking-tight">Ad Placements</h3>
                <button 
                  onClick={() => setEditingAd({ id: `ad_${Date.now()}`, type: 'header', label: 'New Campaign', html: '', active: true })}
                  className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:shadow-xl transition"
                >
                  + ADD NEW AD
                </button>
              </div>

              {editingAd && (
                <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
                  <form onSubmit={saveAd} className="bg-white dark:bg-slate-900 w-full max-w-2xl p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
                    <h4 className="text-2xl font-black">Configure Ad Unit</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input className="p-4 rounded-xl border dark:bg-slate-800 font-bold" placeholder="Placement Label" value={editingAd.label} onChange={e => setEditingAd({...editingAd, label: e.target.value})} required />
                      <select className="p-4 rounded-xl border dark:bg-slate-900 font-bold" value={editingAd.type} onChange={e => setEditingAd({...editingAd, type: e.target.value as any})}>
                        <option value="header">Global Header</option>
                        <option value="footer">Global Footer</option>
                        <option value="sidebar">Sidebar Widget</option>
                        <option value="in-tool">Inside Tools</option>
                      </select>
                    </div>
                    <textarea 
                      className="w-full p-5 rounded-xl border dark:bg-slate-800 font-mono text-sm min-h-[200px]" 
                      placeholder="Paste Ad HTML / JavaScript Script here..." 
                      value={editingAd.html} 
                      onChange={e => setEditingAd({...editingAd, html: e.target.value})}
                      required 
                    />
                    <div className="flex justify-end gap-4">
                      <button type="button" onClick={() => setEditingAd(null)} className="px-8 py-3 font-black text-slate-500 hover:text-slate-900">Cancel</button>
                      <button type="submit" className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black shadow-lg">Deploy Unit</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid gap-6">
                {(Object.values(config.ads) as AdUnit[]).map(ad => (
                  <div key={ad.id} className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl shadow-sm flex items-center justify-center text-blue-600">
                         <i className={`fa-solid ${ad.type === 'header' ? 'fa-window-maximize' : ad.type === 'sidebar' ? 'fa-window-restore' : 'fa-rectangle-list'}`}></i>
                       </div>
                       <div>
                         <p className="font-black text-xl">{ad.label}</p>
                         <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{ad.type} POSITION</p>
                       </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setEditingAd(ad)} className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition"><i className="fa-solid fa-pen"></i></button>
                      <button onClick={() => deleteAd(ad.id)} className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sponsors' && (
            <div className="space-y-10 animate-fade-in">
              <div className="bg-blue-50 dark:bg-blue-900/10 p-10 rounded-[2.5rem] border border-blue-100 dark:border-blue-900 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="text-3xl font-black text-blue-900 dark:text-blue-100 tracking-tight">Sponsor Slider Visibility</h3>
                  <p className="text-blue-700 dark:text-blue-300 font-medium text-lg mt-2">Toggle the homepage logo slider visibility.</p>
                </div>
                <button 
                  onClick={toggleSponsorSlider}
                  className={`w-full md:w-auto px-12 py-5 rounded-2xl font-black text-lg transition shadow-xl ${config.sponsorConfig.enabled ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}
                >
                  {config.sponsorConfig.enabled ? 'SLIDER ENABLED' : 'SLIDER DISABLED'}
                </button>
              </div>

              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-black tracking-tight">Manage Sponsors</h3>
                <button 
                  onClick={() => setEditingSponsor({ id: `sp_${Date.now()}`, name: '', imageUrl: '', link: '#' })}
                  className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:shadow-xl transition"
                >
                  + ADD SPONSOR
                </button>
              </div>

              {editingSponsor && (
                <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
                  <form onSubmit={saveSponsor} className="bg-white dark:bg-slate-900 w-full max-w-2xl p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
                    <h4 className="text-2xl font-black">Sponsor Details</h4>
                    <div className="space-y-4">
                      <input className="w-full p-4 rounded-xl border dark:bg-slate-800 font-bold" placeholder="Sponsor Name" value={editingSponsor.name} onChange={e => setEditingSponsor({...editingSponsor, name: e.target.value})} required />
                      <input className="w-full p-4 rounded-xl border dark:bg-slate-800 font-bold" placeholder="Image URL (Logo)" value={editingSponsor.imageUrl} onChange={e => setEditingSponsor({...editingSponsor, imageUrl: e.target.value})} required />
                      <input className="w-full p-4 rounded-xl border dark:bg-slate-800 font-bold" placeholder="Target Link" value={editingSponsor.link} onChange={e => setEditingSponsor({...editingSponsor, link: e.target.value})} required />
                    </div>
                    <div className="flex justify-end gap-4">
                      <button type="button" onClick={() => setEditingSponsor(null)} className="px-8 py-3 font-black text-slate-500 hover:text-slate-900">Cancel</button>
                      <button type="submit" className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black shadow-lg">Save Sponsor</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid gap-6">
                {config.sponsorConfig.sponsors.map(sponsor => (
                  <div key={sponsor.id} className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl shadow-sm flex items-center justify-center p-2 overflow-hidden">
                         <img src={sponsor.imageUrl} className="max-w-full max-h-full object-contain" alt={sponsor.name} />
                       </div>
                       <div>
                         <p className="font-black text-xl">{sponsor.name}</p>
                         <p className="text-xs font-black text-slate-400 uppercase tracking-widest">External Sponsor</p>
                       </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setEditingSponsor(sponsor)} className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition"><i className="fa-solid fa-pen"></i></button>
                      <button onClick={() => deleteSponsor(sponsor.id)} className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="space-y-10 animate-fade-in">
              <h3 className="text-3xl font-black tracking-tight">Individual Tool Control</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {TOOLS.map(tool => (
                  <div key={tool.id} className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between group">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${config.activeTools[tool.id] ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                        <i className={`fa-solid ${tool.icon}`}></i>
                      </div>
                      <span className="font-black text-lg">{tool.name}</span>
                    </div>
                    <button 
                      onClick={() => toggleTool(tool.id)}
                      className={`w-16 h-8 rounded-full transition-all relative p-1 ${config.activeTools[tool.id] ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-800'}`}
                    >
                      <div className={`w-6 h-6 bg-white rounded-full transition-transform transform ${config.activeTools[tool.id] ? 'translate-x-8' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-10 animate-fade-in">
              <h3 className="text-3xl font-black tracking-tight">Active User Registry</h3>
              <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800">
                    <tr>
                      <th className="px-8 py-6 font-black text-xs uppercase tracking-widest text-slate-400">User Profile</th>
                      <th className="px-8 py-6 font-black text-xs uppercase tracking-widest text-slate-400">Status</th>
                      <th className="px-8 py-6 font-black text-xs uppercase tracking-widest text-slate-400">Access Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black">E</div>
                           <div>
                             <p className="font-black text-slate-900 dark:text-white">easytools@us.com</p>
                             <p className="text-xs font-bold text-slate-500">Root Administrator</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-[10px] font-black uppercase">Online</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="bg-blue-600 text-white text-[10px] px-3 py-1.5 rounded-full font-black uppercase">Owner</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-black">JD</div>
                           <div>
                             <p className="font-black text-slate-900 dark:text-white">john_premium@aol.com</p>
                             <p className="text-xs font-bold text-slate-500">Pro User Since 2024</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-slate-400 font-bold text-xs">Logged in 2h ago</td>
                      <td className="px-8 py-6">
                        <span className="bg-slate-100 dark:bg-slate-800 text-[10px] px-3 py-1.5 rounded-full font-black uppercase">Member</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
