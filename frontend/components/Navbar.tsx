import { ArrowLeft, ChevronDown, List, LogOut, MapPin, Menu, MessageSquare, PlusCircle, Search, Settings, ShieldCheck, User as UserIcon, X } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WILAYAS, handleImgError } from '../constants';
import { useSearchSuggestions } from '../hooks/useSearchSuggestions';
import { Ad, Category, User } from '../types';
import SearchSuggestions from './SearchSuggestions';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type NavVariant = 'default' | 'auto' | 'real-estate' | 'jobs' | 'services';

interface NavbarProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onPostAd: () => void;
  selectedWilaya?: string;
  onWilayaChange?: (wilaya: string) => void;
  variant?: NavVariant;
  showBackButton?: boolean;
  /** Pass the visible ads array to power search suggestions */
  ads?: Ad[];
}

// Maps NavVariant to the Category used for filtering suggestions
const VARIANT_TO_CATEGORY: Record<NavVariant, Category | 'all'> = {
  default:       'all',
  auto:          'auto',
  'real-estate': 'real-estate',
  jobs:          'jobs',
  services:      'services',
};

// ---------------------------------------------------------------------------
// Static theme map — defined at module level, never re-created on render
// ---------------------------------------------------------------------------
// Route each variant maps to — used by search so Navbar never drops the user to the wrong page
const ROUTE_MAP: Record<NavVariant, string> = {
  default:       '/',
  auto:          '/auto',
  'real-estate': '/real-estate',
  jobs:          '/jobs',
  services:      '/services',
};

const THEMES: Record<NavVariant, { bg: string; text: string; accent: string; button: string; border: string }> = {
  default:       { bg: 'bg-white',        text: 'text-slate-900', accent: 'text-blue-600',    button: 'bg-blue-600 hover:bg-blue-700',      border: 'border-gray-200'    },
  auto:          { bg: 'bg-slate-900',    text: 'text-white',     accent: 'text-red-500',     button: 'bg-red-600 hover:bg-red-700',        border: 'border-slate-800'   },
  'real-estate': { bg: 'bg-emerald-900', text: 'text-white',     accent: 'text-emerald-400', button: 'bg-emerald-600 hover:bg-emerald-700', border: 'border-emerald-800' },
  jobs:          { bg: 'bg-blue-900',     text: 'text-white',     accent: 'text-blue-400',    button: 'bg-blue-600 hover:bg-blue-700',      border: 'border-blue-800'    },
  services:      { bg: 'bg-violet-900',   text: 'text-white',     accent: 'text-violet-400',  button: 'bg-violet-600 hover:bg-violet-700',  border: 'border-violet-800'  },
};

// ---------------------------------------------------------------------------
// useClickOutside — closes a panel when clicking outside its ref
// ---------------------------------------------------------------------------
function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, onClose]);
}

const Navbar: React.FC<NavbarProps> = ({
  user,
  onSignIn,
  onSignOut,
  onPostAd,
  selectedWilaya,
  onWilayaChange,
  variant = 'default',
  showBackButton = false,
  ads = [],
}) => {
  const navigate = useNavigate();

  const [isMobileMenuOpen,   setIsMobileMenuOpen]   = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSearchOpen,       setIsSearchOpen]       = useState(false);
  const [searchQuery,        setSearchQuery]        = useState('');
  const [suggIdx,            setSuggIdx]            = useState(-1);
  const [isWilayaOpen,       setIsWilayaOpen]       = useState(false);
  const [wilayaFilter,       setWilayaFilter]       = useState('');

  // Suggestions — only computed when dropdown is open
  const suggestions = useSearchSuggestions(
    isSearchOpen ? searchQuery : '',
    ads,
    VARIANT_TO_CATEGORY[variant],
  );

  const wilayaRef = useRef<HTMLDivElement>(null);
  const userRef   = useRef<HTMLDivElement>(null);

  const closeWilaya = useCallback(() => { setIsWilayaOpen(false); setWilayaFilter(''); }, []);
  const closeUser   = useCallback(() => setIsUserDropdownOpen(false), []);

  useClickOutside(wilayaRef, closeWilaya);
  useClickOutside(userRef,   closeUser);

  // Static lookup — no computation per render
  const theme  = THEMES[variant];
  const isDark = variant !== 'default';

  // Memoized filtered wilaya list
  const filteredWilayas = useMemo(() => {
    const q = wilayaFilter.toLowerCase();
    return [{ code: '', name: 'All Algeria' }, ...WILAYAS].filter(
      (w) => w.name.toLowerCase().includes(q) || w.code.toString().includes(q)
    );
  }, [wilayaFilter]);

  // Memoized nav link definitions — data-driven
  const navLinks = useMemo(() => [
    ...(user?.isAdmin ? [{ to: '/admin',    icon: <ShieldCheck    className="w-4 h-4 mr-3 text-gray-400" />, label: 'Admin Panel' }] : []),
    { to: '/profile',  icon: <UserIcon      className="w-4 h-4 mr-3 text-gray-400" />, label: 'My Profile'  },
    { to: '/my-ads',   icon: <List          className="w-4 h-4 mr-3 text-gray-400" />, label: 'My Listings' },
    { to: '/messages', icon: <MessageSquare className="w-4 h-4 mr-3 text-gray-400" />, label: 'Messages'    },
    { to: '/settings', icon: <Settings      className="w-4 h-4 mr-3 text-gray-400" />, label: 'Settings'    },
  ], [user?.isAdmin]);

  // Stable callbacks
  const handleSignOut = useCallback(() => {
    onSignOut();
    setIsUserDropdownOpen(false);
  }, [onSignOut]);

  const handleWilayaSelect = useCallback((name: string) => {
    onWilayaChange?.(name === 'All Algeria' ? '' : name);
    setIsWilayaOpen(false);
    setWilayaFilter('');
  }, [onWilayaChange]);

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSuggIdx(i => Math.min(i + 1, suggestions.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSuggIdx(i => Math.max(i - 1, -1));
      return;
    }
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchQuery('');
      setSuggIdx(-1);
      return;
    }
    if (e.key === 'Enter') {
      const term = suggIdx >= 0 && suggestions[suggIdx]
        ? suggestions[suggIdx].label
        : searchQuery.trim();
      if (!term) return;
      navigate(`${ROUTE_MAP[variant]}?q=${encodeURIComponent(term)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setSuggIdx(-1);
    }
  }, [searchQuery, suggestions, suggIdx, navigate, variant]);

  const toggleWilaya = useCallback(() => {
    setIsWilayaOpen((v) => !v);
    setIsSearchOpen(false);
    setWilayaFilter('');
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((v) => !v);
    setIsWilayaOpen(false);
    setSearchQuery('');
    setWilayaFilter('');
  }, []);

  return (
    <nav className={`sticky top-0 z-50 ${theme.bg} ${theme.border} border-b shadow-sm transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">

          {/* Left: Back button + Logo */}
          <div className="flex items-center gap-3">
            {isDark || showBackButton ? (
              <Link
                to="/"
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  isDark
                    ? 'text-white/70 hover:text-white hover:bg-white/10'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            ) : (
              <div className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 opacity-0 pointer-events-none select-none" aria-hidden="true">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </div>
            )}
            <div className={`h-6 w-px ${isDark ? 'bg-white/20' : 'bg-gray-200'}`}></div>
            <Link to="/" className="flex items-center gap-2 group">
              <div className={`p-2 rounded-xl ${isDark ? 'bg-white/10' : 'bg-blue-600'} transition-colors`}>
                <span className="font-bold text-xl text-white">D</span>
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-xl leading-none tracking-tight ${theme.text}`}>DABERLI</span>
                {isDark && (
                  <span className={`text-xs font-medium uppercase tracking-widest ${theme.accent}`}>
                    {variant!.replace('-', ' ')}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Wilaya Selector (Only show if props provided) */}
            {selectedWilaya !== undefined && onWilayaChange && (
              <div className="relative" ref={wilayaRef}>
                {/* Single unified pill */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-slate-700'}`}>
                  {/* Location button */}
                  <button
                    onClick={toggleWilaya}
                    className="flex items-center gap-2 focus:outline-none"
                    aria-expanded={isWilayaOpen}
                    aria-haspopup="listbox"
                  >
                    <MapPin className={`w-4 h-4 shrink-0 ${theme.accent}`} />
                    <span className="text-sm font-medium">{selectedWilaya || 'All Algeria'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDark ? 'text-white/50' : 'text-gray-400'} ${isWilayaOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Divider */}
                  <div className={`h-4 w-px ${isDark ? 'bg-white/20' : 'bg-gray-300'}`} />

                  {/* Search toggle */}
                  <button
                    onClick={toggleSearch}
                    aria-label={isSearchOpen ? 'Close search' : 'Open search'}
                    className={`transition-colors ${isDark ? 'text-white/60 hover:text-white' : 'text-slate-400 hover:text-blue-600'} ${isSearchOpen ? isDark ? 'text-white' : 'text-blue-600' : ''}`}
                  >
                    {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                  </button>
                </div>

                {/* Wilaya dropdown */}
                {isWilayaOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    {/* Filter input */}
                    <div className="p-2 border-b border-gray-100">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <Search className="w-4 h-4 text-gray-400 shrink-0" />
                        <input
                          autoFocus
                          type="text"
                          value={wilayaFilter}
                          onChange={(e) => setWilayaFilter(e.target.value)}
                          placeholder="Filter wilayas..."
                          className="bg-transparent text-sm focus:outline-none w-full text-slate-900 placeholder-gray-400"
                        />
                        {wilayaFilter && (
                          <button type="button" aria-label="Clear filter" onClick={() => setWilayaFilter('')} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Options list */}
                    <ul role="listbox" className="max-h-60 overflow-y-auto py-1">
                      {filteredWilayas.map((w) => (
                        <li key={w.code || 'all'} role="option" aria-selected={selectedWilaya === w.name || (w.name === 'All Algeria' && !selectedWilaya)}>
                          <button
                            onClick={() => handleWilayaSelect(w.name)}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                              (selectedWilaya === w.name || (w.name === 'All Algeria' && !selectedWilaya))
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {w.code ? `${w.code} - ${w.name}` : w.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Search dropdown */}
                {isSearchOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 p-3 z-50">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                      <Search className="w-4 h-4 text-gray-400 shrink-0" />
                      <input
                        autoFocus
                        type="text"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={suggestions.length > 0}
                        aria-activedescendant={suggIdx >= 0 ? `nav-sugg-${suggIdx}` : undefined}
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setSuggIdx(-1); }}
                      placeholder="Search listings... (Enter to go)"
                          onKeyDown={handleSearchKeyDown}
                        className="bg-transparent text-sm focus:outline-none w-full text-slate-900 placeholder-gray-400"
                      />
                      {searchQuery && (
                        <button type="button" aria-label="Clear search" onClick={() => { setSearchQuery(''); setSuggIdx(-1); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <SearchSuggestions
                      suggestions={suggestions}
                      query={searchQuery}
                      selectedIndex={suggIdx}
                      onSelect={(label) => {
                        navigate(`${ROUTE_MAP[variant]}?q=${encodeURIComponent(label)}`);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                        setSuggIdx(-1);
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            )}

            <div className={`h-6 w-px ${isDark ? 'bg-white/20' : 'bg-gray-200'}`}></div>

            {/* Post Ad Button */}
            <button 
              onClick={onPostAd}
              className={`${theme.button} text-white px-5 py-2 rounded-full font-medium text-sm flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-blue-900/20`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Ad</span>
            </button>

            {/* User Section */}
            {user ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setIsUserDropdownOpen((v) => !v)}
                  aria-expanded={isUserDropdownOpen}
                  aria-haspopup="menu"
                  className={`flex items-center space-x-3 focus:outline-none ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-50'} p-1.5 pr-3 rounded-full transition-colors border ${isDark ? 'border-white/10' : 'border-transparent'}`}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" onError={handleImgError} />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isDark ? 'bg-white text-slate-900' : 'bg-blue-100 text-blue-600'}`}>
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="text-left hidden lg:block">
                    <p className={`text-sm font-semibold leading-none ${theme.text}`}>{user.name}</p>
                    <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'} mt-0.5`}>View Profile</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 ${isDark ? 'text-white/60' : 'text-gray-400'}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div role="menu" className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden origin-top-right">
                    <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50 text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Menu</p>
                    </div>
                    <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/30 flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border-2 border-white shadow-sm shrink-0" onError={handleImgError} />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate mt-0.5">{user.email}</p>
                      </div>
                    </div>
                    <div className="p-2" role="none">
                      {navLinks.map(({ to, icon, label }) => (
                        <Link
                          key={to}
                          to={to}
                          role="menuitem"
                          onClick={closeUser}
                          className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                        >
                          {icon}{label}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 p-2 bg-gray-50/30">
                      <button
                        role="menuitem"
                        onClick={handleSignOut}
                        className="flex w-full items-center px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4 mr-3" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className={`flex items-center gap-2 font-medium text-sm px-4 py-2 rounded-full transition-colors ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-gray-100'}`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
          
          {/* Mobile: avatar shortcut + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <button
                onClick={() => setIsUserDropdownOpen((v) => !v)}
                aria-label="Open menu"
                className={`p-1 rounded-full border ${isDark ? 'border-white/10' : 'border-gray-200'}`}
              >
                {user.avatar
                  ? <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full" onError={handleImgError} />
                  : <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? 'bg-white text-slate-900' : 'bg-blue-100 text-blue-600'}`}>{user.name.charAt(0)}</div>
                }
              </button>
            )}
            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className={`p-2 rounded-lg ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile nav panel */}
        {isMobileMenuOpen && (
          <div className={`md:hidden border-t ${isDark ? 'border-white/10' : 'border-gray-100'} py-3 space-y-1`}>
            <button
              onClick={() => { onPostAd(); setIsMobileMenuOpen(false); }}
              className={`${theme.button} w-full text-white px-4 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 mb-2`}
            >
              <PlusCircle className="w-4 h-4" /> Post Ad
            </button>
            {user ? (
              <>
                {navLinks.map(({ to, icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2.5 text-sm rounded-xl transition-colors ${isDark ? 'text-white/80 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {icon}{label}
                  </Link>
                ))}
                <button
                  onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                  className="flex w-full items-center px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium border-t border-gray-100 mt-1 pt-3"
                >
                  <LogOut className="w-4 h-4 mr-3" /> Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => { onSignIn(); setIsMobileMenuOpen(false); }}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-sm rounded-xl transition-colors ${isDark ? 'text-white/80 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <UserIcon className="w-4 h-4" /> Sign In
              </button>
            )}
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
