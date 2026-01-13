
import React from 'react';
import { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile | null;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onNavigate: (view: 'home' | 'admin' | 'auth') => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, isDarkMode, toggleDarkMode, onNavigate }) => {
  const whiteLogo = "https://firebasestorage.googleapis.com/v0/b/team-galaxy-90x.appspot.com/o/data%2F177068.png?alt=media&token=af2f644f-ea4d-4bba-a5c2-5d79ff711e76";
  const darkLogo = "https://firebasestorage.googleapis.com/v0/b/team-galaxy-90x.appspot.com/o/data%2F177067.png?alt=media&token=261cfde0-8b5b-4c6b-bc4b-8aae6afefb68";

  return (
    <nav className="sticky top-0 z-[60] bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-900 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Website Logo Section */}
          <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('home')}>
            <img 
              src={isDarkMode ? darkLogo : whiteLogo} 
              className="h-12 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              alt="EasyTools Logo" 
            />
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleDarkMode}
              className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800 shadow-sm"
              aria-label="Toggle Dark Mode"
            >
              <i className={`fa-solid ${isDarkMode ? 'fa-sun text-yellow-500' : 'fa-moon text-blue-600'} text-xl transition-transform duration-500 hover:rotate-45`}></i>
            </button>

            {user ? (
              <div className="flex items-center gap-5">
                {user.isAdmin && (
                  <button 
                    onClick={() => onNavigate('admin')}
                    className="hidden lg:flex items-center gap-2.5 text-sm font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-900 px-5 py-2.5 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-slate-200 dark:border-slate-800"
                  >
                    <i className="fa-solid fa-shield-halved"></i> ADMIN
                  </button>
                )}
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pr-5 pl-2 py-1.5 rounded-full shadow-sm">
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=2563EB&color=fff`} 
                    className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-800"
                    alt="User"
                  />
                  <span className="hidden sm:inline text-sm font-black tracking-tight text-slate-700 dark:text-slate-200">{user.email?.split('@')[0]}</span>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('auth')}
                className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl text-sm font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 dark:shadow-none hover:translate-y-[-2px] active:translate-y-0"
              >
                SIGN IN
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
