import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import FloatingActionBar from '../components/FloatingActionBar';
import Navbar from '../components/Navbar';
import SearchSuggestions from '../components/SearchSuggestions';
import AutoCard from '../components/cards/AutoCard';
import { useSearchSuggestions } from '../hooks/useSearchSuggestions';
import { User, Ad } from '../types';
import { Filter, Search, Car } from 'lucide-react';

interface CategoryPageProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onPostAdClick: () => void;
  ads: Ad[];
  selectedWilaya: string;
  onWilayaChange: (wilaya: string) => void;
}

const AutoPage: React.FC<CategoryPageProps> = ({ user, onSignIn, onSignOut, onPostAdClick, ads, selectedWilaya, onWilayaChange }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(urlQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [suggIdx, setSuggIdx] = useState(-1);
  useEffect(() => { setQuery(urlQuery); }, [urlQuery]);
  const suggestions = useSearchSuggestions(query, ads, 'auto');
  const autoAds = ads.filter(ad =>
    ad.category === 'auto' &&
    (!selectedWilaya || ad.location === selectedWilaya) &&
    (!query || ad.title.toLowerCase().includes(query.toLowerCase()) || ad.location.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar 
          user={user} 
          onSignIn={onSignIn} 
          onSignOut={onSignOut} 
          onPostAd={onPostAdClick} 
          variant="auto"
          selectedWilaya={selectedWilaya} 
          onWilayaChange={onWilayaChange}
          ads={ads}
      />
      
      {/* Auto Hero */}
      <div className="bg-slate-900 py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <pattern id="pattern-auto" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="2" fill="currentColor"></circle>
                </pattern>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-auto)"></rect>
              </svg>
          </div>

          <div className="max-w-7xl mx-auto relative z-10 text-center">
              <div className="inline-block p-3 rounded-full bg-slate-800/50 mb-4 border border-slate-700">
                  <Car className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Find Your Next Ride</h1>
              <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">Browse cars, trucks, and motorcycles across all 58 wilayas of Algeria.</p>

              <div className="relative max-w-4xl mx-auto">
                <div className="bg-white p-4 rounded-lg shadow-2xl flex flex-col md:flex-row gap-4">
                  <div className="flex-1 bg-gray-50 rounded px-4 border border-gray-200 flex items-center gap-2">
                      <Search className="w-5 h-5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={isFocused && suggestions.length > 0}
                        placeholder="Make, Model, or Year..."
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setSuggIdx(-1); }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowDown') { e.preventDefault(); setSuggIdx(i => Math.min(i + 1, suggestions.length - 1)); }
                          else if (e.key === 'ArrowUp') { e.preventDefault(); setSuggIdx(i => Math.max(i - 1, -1)); }
                          else if (e.key === 'Escape') { setIsFocused(false); setSuggIdx(-1); }
                          else if (e.key === 'Enter') {
                            const term = suggIdx >= 0 && suggestions[suggIdx] ? suggestions[suggIdx].label : query.trim();
                            if (term) { setSearchParams({ q: term }); setSuggIdx(-1); setIsFocused(false); }
                          }
                        }}
                        className="bg-transparent w-full py-3 focus:outline-none text-slate-900"
                      />
                  </div>
                  <div className="w-full md:w-48 bg-gray-50 rounded px-4 border border-gray-200">
                      <label htmlFor="vehicle-type" className="sr-only">Vehicle Type</label>
                      <select id="vehicle-type" title="Vehicle Type" className="bg-transparent w-full py-3 focus:outline-none text-gray-600">
                          <option>All Types</option>
                          <option>Car</option>
                          <option>Truck</option>
                          <option>Motorcycle</option>
                      </select>
                  </div>
                  <button onClick={() => setSearchParams(query.trim() ? { q: query.trim() } : {})} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded font-bold transition-colors">
                      Search Cars
                  </button>
                </div>
                {isFocused && (
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
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Latest Listings</h2>
                <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 border border-slate-200 px-4 py-2 rounded-lg bg-white">
                    <Filter className="w-4 h-4" /> Filters
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {autoAds.map(ad => (
                    <AutoCard key={ad.id} ad={ad} />
                ))}
            </div>
      </div>
      <Footer />
      <FloatingActionBar
        onHome={() => navigate('/')}
        onPostAd={onPostAdClick}
        onProfile={() => navigate('/profile')}
      />
    </div>
  );
};

export default AutoPage;
