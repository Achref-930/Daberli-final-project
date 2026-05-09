import { List, Home, PlusCircle, Search, User } from 'lucide-react';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface FloatingActionBarProps {
  onHome: () => void;
  onPostAd: () => void;
  onProfile: () => void;
}

const FloatingActionBar: React.FC<FloatingActionBarProps> = ({ onHome, onPostAd, onProfile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const getBtnClass = (isActive: boolean) =>
    `flex flex-col items-center gap-1 transition-colors w-14 pb-1 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)] ${
      isActive ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'
    }`;

  const handleSearchSubmit = (val: string) => {
    if (!val) return;
    let targetPath = '/';
    const validPaths = ['/auto', '/real-estate', '/jobs', '/services'];
    if (validPaths.some(p => location.pathname.startsWith(p))) {
      targetPath = location.pathname;
    }
    navigate(`${targetPath}?q=${encodeURIComponent(val)}`);
    setIsSearchOpen(false);
  };

  return (
    <>
      {/* Search Drop-down (Top of screen) */}
      {isSearchOpen && (
        <>
          {/* Full-screen backdrop to catch outside clicks */}
          <div 
            className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="fixed top-4 left-4 right-4 z-50 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-3 border border-slate-200/80 animate-fade-up">
            <div className="flex items-center gap-2 bg-slate-100/80 border border-slate-200 rounded-xl px-4 py-2.5">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search listings…"
                className="bg-transparent text-base focus:outline-none w-full text-slate-900 placeholder-slate-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit((e.target as HTMLInputElement).value.trim());
                  }
                }}
              />
            </div>
          </div>
        </>
      )}

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200/80 px-4 pt-3 md:hidden safe-area-pb nav-glass"
        aria-label="Mobile navigation"
      >
        <div className="flex justify-between items-end max-w-sm mx-auto">

          <button
            id="fab-home"
            onClick={() => {
              setIsSearchOpen(false);
              onHome();
            }}
            className={getBtnClass(location.pathname === '/')}
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-semibold font-heading">Home</span>
          </button>

          <button
            id="fab-my-ads"
            onClick={() => {
              setIsSearchOpen(false);
              navigate('/my-ads');
            }}
            className={getBtnClass(location.pathname === '/my-ads')}
          >
            <List className="w-6 h-6" />
            <span className="text-[10px] font-semibold font-heading">My Ads</span>
          </button>

          {/* Centre CTA — elevated */}
          <button
            id="fab-post"
            onClick={() => {
              setIsSearchOpen(false);
              onPostAd();
            }}
            className="flex flex-col items-center justify-end -mt-7 group relative"
          >
            <div
              className="text-white p-3.5 rounded-full shadow-xl transform group-hover:-translate-y-1 group-active:scale-90 transition-all duration-200 border-4 border-white"
              style={{ backgroundColor: 'var(--color-brand-navy)' }}
            >
              <PlusCircle className="w-7 h-7" strokeWidth={2} />
            </div>
            <span className="mt-1 text-[10px] font-bold font-heading" style={{ color: 'var(--color-brand-navy)' }}>Post</span>
          </button>

          <button
            id="fab-search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={getBtnClass(isSearchOpen || location.pathname === '/search')}
          >
            <Search className="w-6 h-6" />
            <span className="text-[10px] font-semibold font-heading">Search</span>
          </button>

          <button
            id="fab-profile"
            onClick={() => {
              setIsSearchOpen(false);
              onProfile();
            }}
            className={getBtnClass(location.pathname === '/profile')}
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] font-semibold font-heading">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default FloatingActionBar;
