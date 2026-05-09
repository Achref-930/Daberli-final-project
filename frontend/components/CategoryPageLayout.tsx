/**
 * CategoryPageLayout
 * Shared layout shell used by AutoPage, RealEstatePage, JobsPage, ServicesPage.
 * Handles Navbar + hero + listing grid + Footer + FloatingActionBar.
 * Mobile-first: hero is compact on small screens, expands on md+.
 */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar, { NavVariant } from './Navbar';
import Footer from './Footer';
import FloatingActionBar from './FloatingActionBar';
import SearchSuggestions from './SearchSuggestions';
import { useSearchSuggestions } from '../hooks/useSearchSuggestions';
import { Ad, User } from '../types';
import { Search, SlidersHorizontal, X } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FilterOption {
  label: string;
  value: string;
}

export interface CategoryHeroConfig {
  variant: NavVariant;
  /** Lucide icon node */
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  /** Accent Tailwind classes for the CTA search button */
  accentBg: string;
  accentHover: string;
  /** Gradient from/via/to — Tailwind classes */
  gradientFrom: string;
  gradientTo: string;
  filterOptions?: FilterOption[];
  filterLabel?: string;
  filterAriaLabel?: string;
  ctaLabel: string;
}

interface CategoryPageLayoutProps {
  config: CategoryHeroConfig;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onPostAd: () => void;
  ads: Ad[];
  selectedWilaya: string;
  onWilayaChange: (wilaya: string) => void;
  /** Filtered ad list ready to render */
  filteredAds: Ad[];
  /** How to render each card */
  renderCard: (ad: Ad) => React.ReactNode;
  /** Optional heading above the grid */
  gridHeading?: string;
  /** Grid layout — defaults to 3 cols on lg */
  gridCols?: string;
  /** Use list layout instead of grid (e.g. Jobs) */
  listLayout?: boolean;
  /** Optional sidebar content (e.g. Jobs filter sidebar) */
  sidebar?: React.ReactNode;
  /** Pass to filter query from parent (controlled) */
  query?: string;
  onQueryChange?: (q: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const CategoryPageLayout: React.FC<CategoryPageLayoutProps> = ({
  config,
  user,
  onSignIn,
  onSignOut,
  onPostAd,
  ads,
  selectedWilaya,
  onWilayaChange,
  filteredAds,
  renderCard,
  gridHeading,
  gridCols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  listLayout = false,
  sidebar,
  query: externalQuery,
  onQueryChange,
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';

  // Internal query state — synced to URL
  const [localQuery, setLocalQuery] = useState(urlQuery);
  const [isFocused, setIsFocused]   = useState(false);
  const [suggIdx,   setSuggIdx]     = useState(-1);

  useEffect(() => { setLocalQuery(urlQuery); }, [urlQuery]);

  const query = externalQuery ?? localQuery;
  const handleQueryChange = (q: string) => {
    setLocalQuery(q);
    onQueryChange?.(q);
    setSuggIdx(-1);
  };

  const suggestions = useSearchSuggestions(query, ads, config.variant === 'default' ? 'all' : config.variant as any);
  const inputRef = useRef<HTMLInputElement>(null);

  const doSearch = () => {
    const term = suggIdx >= 0 && suggestions[suggIdx] ? suggestions[suggIdx].label : query.trim();
    if (term) setSearchParams({ q: term });
    else setSearchParams({});
    setSuggIdx(-1);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSuggIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === 'ArrowUp')  { e.preventDefault(); setSuggIdx(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Escape')   { setIsFocused(false); setSuggIdx(-1); }
    else if (e.key === 'Enter')    { doSearch(); }
  };

  return (
    <div className="min-h-screen bg-brand-surface flex flex-col">
      <Navbar
        user={user}
        onSignIn={onSignIn}
        onSignOut={onSignOut}
        onPostAd={onPostAd}
        variant={config.variant}
        selectedWilaya={selectedWilaya}
        onWilayaChange={onWilayaChange}
        ads={ads}
      />

      {/* ── Hero ── */}
      <section className={`relative overflow-hidden bg-linear-to-br ${config.gradientFrom} ${config.gradientTo} pt-24 pb-10 sm:pt-32 sm:pb-16 px-4`}>
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 hero-dot-pattern opacity-20 pointer-events-none" />
        {/* Soft glow blob */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-20 bg-white pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center z-10">
          {/* Icon badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-4xl bg-white/10 backdrop-blur-xl border border-white/20 mb-8 shadow-2xl">
            {config.icon}
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter leading-tight">
            {config.title}
          </h1>
          <p className="text-white/70 text-lg sm:text-xl mb-10 max-w-2xl mx-auto font-medium">
            {config.subtitle}
          </p>

          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 bg-white rounded-4xl p-2.5 shadow-2xl shadow-black/20">
              {/* Search input */}
              <div className="flex-1 flex items-center gap-3 bg-slate-50 rounded-3xl px-5 py-3 transition-all focus-within:bg-white focus-within:ring-4 focus-within:ring-apple-blue/5">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={isFocused && suggestions.length > 0}
                  placeholder={config.searchPlaceholder}
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent text-sm focus:outline-none w-full text-slate-900 placeholder-slate-300 font-bold min-w-0"
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => { handleQueryChange(''); setSearchParams({}); }}
                    className="text-slate-300 hover:text-slate-500 shrink-0 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Filter select — shown if filterOptions provided */}
              {config.filterOptions && config.filterOptions.length > 0 && (
                <div className="sm:w-44 bg-slate-50 rounded-3xl px-5 py-3 transition-all">
                  <label htmlFor={`${config.variant}-filter`} className="sr-only">{config.filterAriaLabel}</label>
                  <select
                    id={`${config.variant}-filter`}
                    title={config.filterLabel}
                    className="bg-transparent w-full focus:outline-none text-sm text-slate-500 font-bold appearance-none cursor-pointer"
                  >
                    {config.filterOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* CTA button */}
              <button
                onClick={doSearch}
                className={`apple-button ${config.accentBg} ${config.accentHover} text-white px-8 py-3 rounded-3xl font-black text-sm transition-all font-heading shrink-0 shadow-lg shadow-black/10`}
              >
                {config.ctaLabel}
              </button>
            </div>

            {/* Suggestions dropdown */}
            {isFocused && suggestions.length > 0 && (
              <SearchSuggestions
                suggestions={suggestions}
                query={query}
                selectedIndex={suggIdx}
                onSelect={(label) => { setSearchParams({ q: label }); setIsFocused(false); setSuggIdx(-1); }}
                onMouseDown={(e) => e.preventDefault()}
                className="absolute top-full left-0 right-0 mt-1.5 z-50"
              />
            )}
          </div>
        </div>
      </section>

      {/* ── Listings area ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Optional heading row */}
        {gridHeading && (
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {gridHeading}
              {filteredAds.length > 0 && (
                <span className="ml-3 text-sm font-bold text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100 font-sans">
                  {filteredAds.length}
                </span>
              )}
            </h2>
            <button className="apple-button flex items-center gap-2 text-sm font-bold text-slate-600 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-100 transition-all hover:shadow-md active:scale-95">
              <SlidersHorizontal className="w-4 h-4" /> 
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar (optional — e.g. Jobs) */}
          {sidebar && (
            <aside className="hidden lg:block w-56 xl:w-64 shrink-0">
              {sidebar}
            </aside>
          )}

          {/* Card grid / list */}
          <div className="flex-1 min-w-0">
            {filteredAds.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                <Search className="w-10 h-10 text-gray-300 mb-3" />
                <p className="font-heading font-semibold text-gray-500 mb-1">No listings found</p>
                {query && (
                  <button
                    onClick={() => { handleQueryChange(''); setSearchParams({}); }}
                    className="mt-2 text-sm text-blue-600 hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : listLayout ? (
              <div className="space-y-4">
                {filteredAds.map((ad) => renderCard(ad))}
              </div>
            ) : (
              <div className={`grid ${gridCols} gap-5`}>
                {filteredAds.map((ad) => renderCard(ad))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <FloatingActionBar
        onHome={() => navigate('/')}
        onPostAd={onPostAd}
        onProfile={user ? () => navigate('/profile') : onSignIn}
      />
    </div>
  );
};

export default CategoryPageLayout;
