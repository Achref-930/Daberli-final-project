import {
  ArrowLeft, ChevronDown, List, LogOut, MapPin, Menu,
  MessageSquare, PlusCircle, Search, Settings, ShieldCheck,
  User as UserIcon, X, Car, Home, Briefcase, Wrench, Zap
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  forceScrolled?: boolean;
  ads?: Ad[];
}

// Maps NavVariant → search route
const ROUTE_MAP: Record<NavVariant, string> = {
  default:       '/',
  auto:          '/auto',
  'real-estate': '/real-estate',
  jobs:          '/jobs',
  services:      '/services',
};

// Maps NavVariant → Category for suggestion filtering
const VARIANT_TO_CATEGORY: Record<NavVariant, Category | 'all'> = {
  default:       'all',
  auto:          'auto',
  'real-estate': 'real-estate',
  jobs:          'jobs',
  services:      'services',
};

// Category badge metadata
const CATEGORY_META: Record<NavVariant, { label: string; bg: string; text: string; icon: React.ReactNode } | null> = {
  default:       null,
  auto:          { label: 'Vehicles',    bg: 'bg-red-100',    text: 'text-red-700',    icon: <Car       className="w-3 h-3" /> },
  'real-estate': { label: 'Real Estate', bg: 'bg-emerald-100', text: 'text-emerald-700', icon: <Home      className="w-3 h-3" /> },
  jobs:          { label: 'Jobs',        bg: 'bg-blue-100',   text: 'text-blue-700',   icon: <Briefcase className="w-3 h-3" /> },
  services:      { label: 'Services',    bg: 'bg-violet-100', text: 'text-violet-700', icon: <Wrench    className="w-3 h-3" /> },
};

// ---------------------------------------------------------------------------
// useClickOutside
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

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------
const Navbar: React.FC<NavbarProps> = ({
  user,
  onSignIn,
  onSignOut,
  onPostAd,
  selectedWilaya,
  onWilayaChange,
  variant = 'default',
  showBackButton = false,
  forceScrolled,
  ads = [],
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen,   setIsMobileMenuOpen]   = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSearchOpen,       setIsSearchOpen]       = useState(false);
  const [searchQuery,        setSearchQuery]        = useState('');
  const [suggIdx,            setSuggIdx]            = useState(-1);
  const [isWilayaOpen,       setIsWilayaOpen]       = useState(false);
  const [isMobileCatOpen,    setIsMobileCatOpen]    = useState(false);
  const [wilayaFilter,       setWilayaFilter]       = useState('');
  const [scrolled,           setScrolled]           = useState(false);
  const [avatarError,        setAvatarError]        = useState(false);

  // Track scroll for glass effect
  useEffect(() => {
    if (forceScrolled) {
      setScrolled(true);
      return undefined;
    }
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [forceScrolled]);

  const isScrolled = forceScrolled ?? scrolled;

  const suggestions = useSearchSuggestions(
    isSearchOpen ? searchQuery : '',
    ads,
    VARIANT_TO_CATEGORY[variant],
  );

  const wilayaRef    = useRef<HTMLDivElement>(null);
  const userRef      = useRef<HTMLDivElement>(null);
  const mobileCatRef = useRef<HTMLDivElement>(null);

  const closeWilaya    = useCallback(() => { setIsWilayaOpen(false); setWilayaFilter(''); }, []);
  const closeUser      = useCallback(() => setIsUserDropdownOpen(false), []);
  const closeMobileCat = useCallback(() => setIsMobileCatOpen(false), []);

  useClickOutside(wilayaRef,    closeWilaya);
  useClickOutside(userRef,      closeUser);
  useClickOutside(mobileCatRef, closeMobileCat);

  const catMeta = CATEGORY_META[variant];
  const displayName = user
    ? (user.name.length > 14 ? `${user.name.slice(0, 14)}...` : user.name)
    : '';
  const showAvatarFallback = !user?.avatar || avatarError;

  useEffect(() => {
    setAvatarError(false);
  }, [user?.avatar]);

  // Filtered wilaya list
  const filteredWilayas = useMemo(() => {
    const q = wilayaFilter.toLowerCase();
    return [{ code: '', name: 'All Algeria' }, ...WILAYAS].filter(
      (w) => w.name.toLowerCase().includes(q) || w.code.toString().includes(q)
    );
  }, [wilayaFilter]);

  // Nav links for user dropdown
  const navLinks = useMemo(() => [
    ...(user?.isAdmin ? [{ to: '/admin',    icon: <ShieldCheck    className="w-4 h-4 mr-3 text-gray-400" />, label: 'Admin Panel' }] : []),
    { to: '/profile',  icon: <UserIcon      className="w-4 h-4 mr-3 text-gray-400" />, label: 'My Profile'  },
    { to: '/my-ads',   icon: <List          className="w-4 h-4 mr-3 text-gray-400" />, label: 'My Listings' },
    { to: '/boosted',  icon: <Zap           className="w-4 h-4 mr-3 text-amber-500" />, label: 'Boosted Ads' },
    { to: '/messages', icon: <MessageSquare className="w-4 h-4 mr-3 text-gray-400" />, label: 'Messages'    },
    { to: '/settings', icon: <Settings      className="w-4 h-4 mr-3 text-gray-400" />, label: 'Settings'    },
  ], [user?.isAdmin]);

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
    if (e.key === 'ArrowDown') { e.preventDefault(); setSuggIdx(i => Math.min(i + 1, suggestions.length - 1)); return; }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSuggIdx(i => Math.max(i - 1, -1)); return; }
    if (e.key === 'Escape')    { setIsSearchOpen(false); setSearchQuery(''); setSuggIdx(-1); return; }
    if (e.key === 'Enter') {
      const term = suggIdx >= 0 && suggestions[suggIdx] ? suggestions[suggIdx].label : searchQuery.trim();
      if (!term) return;
      navigate(`${ROUTE_MAP[variant]}?q=${encodeURIComponent(term)}`);
      setIsSearchOpen(false); setSearchQuery(''); setSuggIdx(-1);
    }
  }, [searchQuery, suggestions, suggIdx, navigate, variant]);

  const toggleWilaya = useCallback(() => { setIsWilayaOpen(v => !v); setIsSearchOpen(false); setWilayaFilter(''); }, []);
  const toggleSearch = useCallback(() => { setIsSearchOpen(v => !v); setIsWilayaOpen(false); setSearchQuery(''); setWilayaFilter(''); }, []);

  const showBack = variant !== 'default' || showBackButton;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-100 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-10">
        <nav
          className={`flex items-center justify-between h-14 sm:h-16 gap-3 sm:gap-4 ${
            isScrolled ? 'nav--scrolled' : 'nav--transparent'
          }`}
        >

          {/* ── Left: back + logo + categories + badge ── */}
          <div className="flex items-center gap-6 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              {/* Premium Back Button (Hardware Circle + Glass + Micro-animation) */}
              <button
                onClick={showBack ? () => navigate(-1) : undefined}
                aria-label="Go back"
                disabled={!showBack}
                className={`p-2 mr-2 rounded-full shrink-0 flex items-center justify-center transition-all duration-200 group active:scale-95 ${
                  showBack 
                    ? 'bg-transparent hover:bg-white/20 border border-slate-200/80 shadow-sm text-slate-700 cursor-pointer' 
                    : 'invisible opacity-0 pointer-events-none'
                }`}
              >
                <ArrowLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
              </button>

              <Link to="/" className="flex items-center shrink-0 transition-opacity duration-150 active:scale-95">
                <span 
                  className="text-2xl sm:text-[1.8rem] font-black tracking-tight font-heading drop-shadow-sm" 
                  style={{ color: isScrolled ? 'var(--color-apple-blue)' : '#FFFFFF' }}
                >
                  Daberli
                </span>
              </Link>
            </div>

            {/* Category badge dropdown — visible on small screens only */}
            {catMeta && (
              <div className="relative md:hidden shrink-0" ref={mobileCatRef}>
                <button
                  onClick={() => setIsMobileCatOpen(v => !v)}
                  className={`inline-flex items-center cat-pill ${catMeta.bg} ${catMeta.text} transition-transform active:scale-95`}
                >
                  {catMeta.icon}
                  {catMeta.label}
                  <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${isMobileCatOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMobileCatOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 border border-gray-100 z-50 animate-fade-up">
                    {[
                      { key: 'auto',        to: '/auto',        icon: Car,       label: 'Vehicles',    color: 'text-red-500',    hoverBg: 'hover:bg-red-50' },
                      { key: 'real-estate', to: '/real-estate', icon: Home,      label: 'Real Estate', color: 'text-emerald-500',hoverBg: 'hover:bg-emerald-50' },
                      { key: 'jobs',        to: '/jobs',        icon: Briefcase, label: 'Jobs',        color: 'text-blue-500',   hoverBg: 'hover:bg-blue-50' },
                      { key: 'services',    to: '/services',    icon: Wrench,    label: 'Services',    color: 'text-violet-500', hoverBg: 'hover:bg-violet-50' },
                    ].map(({ key, to, icon: Icon, label, color, hoverBg }) => {
                      const isCurrent = variant === key;
                      return (
                        <Link
                          key={key}
                          to={to}
                          onClick={() => setIsMobileCatOpen(false)}
                          className={`flex items-center px-4 py-2.5 text-sm font-semibold transition-colors font-heading ${
                            isCurrent ? 'bg-gray-50 text-slate-900' : `text-slate-600 ${hoverBg}`
                          }`}
                        >
                          <Icon className={`w-4 h-4 mr-3 ${isCurrent ? color : 'text-slate-400'}`} />
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── Inline Desktop Categories ── */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {[
                { to: '/auto', label: 'Vehicles', activeColor: 'text-apple-blue', hoverColor: 'hover:text-apple-blue', lineColor: 'after:bg-apple-blue' },
                { to: '/real-estate', label: 'Real Estate', activeColor: 'text-emerald-500', hoverColor: 'hover:text-emerald-500', lineColor: 'after:bg-emerald-500' },
                { to: '/jobs', label: 'Jobs', activeColor: 'text-apple-blue', hoverColor: 'hover:text-apple-blue', lineColor: 'after:bg-apple-blue' },
                { to: '/services', label: 'Services', activeColor: 'text-violet-500', hoverColor: 'hover:text-violet-500', lineColor: 'after:bg-violet-500' },
              ].map(({ to, label, activeColor, hoverColor, lineColor }) => {
                const isActive = location.pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`relative text-sm font-bold whitespace-nowrap transition-all duration-200 py-1 active:scale-95 ${
                      isActive ? activeColor : isScrolled ? 'text-slate-600' : 'text-white/80'
                    } ${hoverColor} font-heading after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:transition-transform after:duration-300 after:origin-center ${
                      isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
                    } ${lineColor}`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Desktop centre: wilaya + search pill ── */}
          <div className="hidden md:flex items-center gap-5 flex-1 justify-end xl:pr-4">
            {selectedWilaya !== undefined && onWilayaChange && (
              <div className="relative" ref={wilayaRef}>
                {/* Unified pill */}
                <div className={`inline-flex items-center gap-3 rounded-full px-4 py-2 transition-all shadow-sm ${isScrolled ? 'bg-slate-100' : 'bg-white/10 backdrop-blur-md border border-white/20'}`}>
                  {/* Location */}
                  <button onClick={toggleWilaya} className="flex items-center gap-2 focus:outline-none min-w-0 group">
                    <MapPin className={`w-4 h-4 shrink-0 transition-colors ${isScrolled ? 'text-slate-500 group-hover:text-apple-blue' : 'text-white'}`} />
                    <span className={`text-sm font-semibold truncate max-w-32.5 font-heading ${isScrolled ? 'text-slate-700' : 'text-white'}`}>
                      {selectedWilaya || 'All Algeria'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform shrink-0 ${isWilayaOpen ? 'rotate-180' : ''} ${isScrolled ? 'text-slate-400' : 'text-white/60'}`} />
                  </button>

                  <div className="h-5 w-px bg-gray-300 shrink-0" />

                  {/* Search toggle */}
                  <button
                    onClick={toggleSearch}
                    aria-label={isSearchOpen ? 'Close search' : 'Open search'}
                    className={`transition-colors shrink-0 flex items-center justify-center p-1.5 rounded-full ${
                      isScrolled 
                        ? 'text-slate-400 hover:text-apple-blue hover:bg-apple-blue/10' 
                        : 'text-white/80 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                  </button>
                </div>

                {/* Wilaya dropdown */}
                {isWilayaOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
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
                    <ul className="max-h-60 overflow-y-auto py-1">
                      {filteredWilayas.map((w) => (
                        <li
                          key={w.code || 'all'}
                          onClick={() => handleWilayaSelect(w.name)}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                            (selectedWilaya === w.name || (w.name === 'All Algeria' && !selectedWilaya))
                              ? 'bg-blue-50 text-blue-600 font-semibold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {w.code ? `${w.code} - ${w.name}` : w.name}
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
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setSuggIdx(-1); }}
                        placeholder="Search listings… (Enter to go)"
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
                      listId="navbar-search-suggestions"
                      optionIdPrefix="nav-sugg"
                      suggestions={suggestions}
                      query={searchQuery}
                      selectedIndex={suggIdx}
                      onSelect={(label) => {
                        navigate(`${ROUTE_MAP[variant]}?q=${encodeURIComponent(label)}`);
                        setIsSearchOpen(false); setSearchQuery(''); setSuggIdx(-1);
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Desktop right: Post Ad + user ── */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={onPostAd}
              className="apple-button flex items-center gap-2 bg-apple-blue hover:bg-apple-blue-dark text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-md shadow-apple-blue/20 font-heading"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Ad</span>
            </button>

            {user ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(v => !v)}
                  aria-haspopup="menu"
                  className="profile-pill group flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full focus:outline-none"
                >
                  {/* Avatar with fallback */}
                  <div className="relative w-[30px] h-[30px]">
                    {user.avatar && (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className={`w-full h-full rounded-full object-cover ${showAvatarFallback ? 'hidden' : ''}`}
                        onError={() => setAvatarError(true)}
                        onLoad={() => setAvatarError(false)}
                      />
                    )}
                    <div
                      className={`absolute inset-0 items-center justify-center w-full h-full rounded-full text-white font-bold text-sm bg-[#e05a5a] ${
                        showAvatarFallback ? 'flex' : 'hidden'
                      }`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* User name (truncated) */}
                  <span className="profile-name text-sm font-semibold hidden lg:block font-heading">
                    {displayName}
                  </span>

                  {/* Caret */}
                  <span className="profile-caret text-xs">
                    ▾
                  </span>
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 z-50 overflow-hidden">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border-2 border-white shadow-sm shrink-0" onError={handleImgError} />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 font-heading">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate font-heading">{user.email}</p>
                      </div>
                    </div>
                    <div className="p-2">
                      {navLinks.map(({ to, icon, label }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={closeUser}
                          className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors"
                        >
                          {icon}{label}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 p-2">
                      <button
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
                className={`apple-button flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full transition-all font-heading ${
                  isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/20'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>

          {/* ── Mobile right: avatar + hamburger ── */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <button
                onClick={() => setIsUserDropdownOpen(v => !v)}
                aria-label="Open menu"
                className="p-1 rounded-full border border-gray-200"
              >
                {user.avatar
                  ? <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full" onError={handleImgError} />
                  : <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold font-heading">{user.name.charAt(0)}</div>
                }
              </button>
            )}
            <button
              type="button"
              aria-label="Toggle navigation menu"
              onClick={() => setIsMobileMenuOpen(v => !v)}
              className="p-2 rounded-lg text-slate-600 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* ── Mobile panel ── */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 py-4 animate-fade-up">
          <div className="mx-4 rounded-2xl bg-white/90 backdrop-blur-md border border-gray-100 shadow-sm p-4 space-y-4">
            {/* Mobile search */}
            {selectedWilaya !== undefined && onWilayaChange && (
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Search</p>
                <div className="flex items-center gap-2 bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-apple-blue/10">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search listings…"
                    className="bg-transparent text-sm focus:outline-none w-full text-slate-900 placeholder-gray-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value.trim();
                        if (val) navigate(`${ROUTE_MAP[variant]}?q=${encodeURIComponent(val)}`);
                        setIsMobileMenuOpen(false);
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* Mobile Categories (Horizontal Scroll) */}
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Categories</p>
              <div className="flex overflow-x-auto gap-2 pb-2 snap-x hide-scrollbar">
                {[
                  { to: '/auto', icon: Car, label: 'Vehicles' },
                  { to: '/real-estate', icon: Home, label: 'Real Estate' },
                  { to: '/jobs', icon: Briefcase, label: 'Jobs' },
                  { to: '/services', icon: Wrench, label: 'Services' },
                ].map(({ to, icon: Icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 whitespace-nowrap snap-start transition-colors font-heading hover:bg-slate-50"
                  >
                    <Icon className="w-4 h-4 shrink-0 text-slate-500" />
                    <span className="text-sm font-semibold">{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Actions</p>
              <Link
                to="/boosted"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-amber-50 text-amber-700 border border-amber-100 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 font-heading"
              >
                <Zap className="w-4 h-4 fill-current" /> Boosted Ads
              </Link>

              <button
                onClick={() => { onPostAd(); setIsMobileMenuOpen(false); }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 font-heading"
              >
                <PlusCircle className="w-4 h-4" /> Post Ad
              </button>
            </div>

            {/* Account */}
            {user ? (
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account</p>
                <div className="space-y-1">
                  {navLinks.map(({ to, icon, label }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      {icon}{label}
                    </Link>
                  ))}
                </div>
                <button
                  onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                  className="flex w-full items-center px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium border-t border-gray-100 mt-1 pt-3"
                >
                  <LogOut className="w-4 h-4 mr-3" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account</p>
                <button
                  onClick={() => { onSignIn(); setIsMobileMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <UserIcon className="w-4 h-4" /> Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
