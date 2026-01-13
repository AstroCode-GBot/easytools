
import React from 'react';
import { SystemConfig, AdUnit } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  config: SystemConfig;
}

const Layout: React.FC<LayoutProps> = ({ children, config }) => {
  // Cast to AdUnit[] to fix "Property does not exist on type 'unknown'" errors
  const ads = Object.values(config.ads) as AdUnit[];
  const headerAd = ads.find(a => a.type === 'header' && a.active);
  const footerAd = ads.find(a => a.type === 'footer' && a.active);
  const sidebarAds = ads.filter(a => a.type === 'sidebar' && a.active);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Dynamic Header Ad */}
      {headerAd && (
        <div 
          className="mb-10 w-full p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center border border-slate-200 dark:border-slate-800 min-h-[100px] shadow-sm"
          dangerouslySetInnerHTML={{ __html: headerAd.html }}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 min-w-0">
          {children}
        </div>
        
        {/* Dynamic Sidebar */}
        <aside className="hidden lg:block w-80 space-y-6">
           <div className="sticky top-28 space-y-6">
             <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
               <h4 className="font-black mb-6 text-slate-900 dark:text-white uppercase text-xs tracking-[0.2em]">Sponsored Content</h4>
               <div className="space-y-6">
                 {sidebarAds.length > 0 ? sidebarAds.map(ad => (
                   <div key={ad.id} className="min-h-[200px] bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center p-4 border border-slate-100 dark:border-slate-800 overflow-hidden" dangerouslySetInnerHTML={{ __html: ad.html }} />
                 )) : (
                   <div className="h-40 bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-dashed flex items-center justify-center text-slate-300">
                     Empty Ad Unit
                   </div>
                 )}
               </div>
             </div>

             <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-2xl shadow-blue-400 dark:shadow-none">
                <p className="text-xs font-black uppercase opacity-60 mb-2">Pro Feature</p>
                <h5 className="text-xl font-black mb-4">Unlimited AI Power</h5>
                <p className="text-sm font-medium mb-6 opacity-80 leading-relaxed">Unlock advanced YouTube analytics and resume building with our Premium plan.</p>
                <button className="w-full bg-white text-blue-600 py-3 rounded-2xl font-black hover:bg-slate-100 transition">Upgrade Now</button>
             </div>
           </div>
        </aside>
      </div>

      {/* Dynamic Footer Ad */}
      {footerAd && (
        <div 
          className="mt-20 w-full p-10 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center border border-slate-200 dark:border-slate-800 min-h-[150px]"
          dangerouslySetInnerHTML={{ __html: footerAd.html }}
        />
      )}

      <footer className="mt-16 text-center py-12 border-t dark:border-slate-900">
        <p className="text-slate-400 font-bold text-sm tracking-wide">
          &copy; 2024 EasyTools. Fully production-ready Utility Suite. Optimized for US Market.
        </p>
        <div className="flex justify-center gap-6 mt-6 text-slate-300 dark:text-slate-700">
          <i className="fa-brands fa-cc-visa text-2xl"></i>
          <i className="fa-brands fa-cc-mastercard text-2xl"></i>
          <i className="fa-brands fa-cc-paypal text-2xl"></i>
        </div>
      </footer>
    </main>
  );
};

export default Layout;
