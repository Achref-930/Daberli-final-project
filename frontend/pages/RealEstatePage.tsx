import { Home } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import FloatingActionBar from '../components/FloatingActionBar';
import Navbar from '../components/Navbar';
import SearchSuggestions from '../components/SearchSuggestions';
import RealEstateCard from '../components/cards/RealEstateCard';
import { useSearchSuggestions } from '../hooks/useSearchSuggestions';
import { Ad, User } from '../types';

interface CategoryPageProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onPostAdClick: () => void;
  ads: Ad[];
  selectedWilaya: string;
  onWilayaChange: (wilaya: string) => void;
}

const RealEstatePage: React.FC<CategoryPageProps> = ({ user, onSignIn, onSignOut, onPostAdClick, ads, selectedWilaya, onWilayaChange }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(urlQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [suggIdx, setSuggIdx] = useState(-1);
  useEffect(() => { setQuery(urlQuery); }, [urlQuery]);
  const suggestions = useSearchSuggestions(query, ads, 'real-estate');
  const reAds = ads.filter(ad =>
    ad.category === 'real-estate' &&
    (!selectedWilaya || ad.location === selectedWilaya) &&
    (!query || ad.title.toLowerCase().includes(query.toLowerCase()) || ad.location.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-stone-50 font-serif">
      <Navbar 
          user={user} 
          onSignIn={onSignIn} 
          onSignOut={onSignOut} 
          onPostAd={onPostAdClick} 
          variant="real-estate"
          selectedWilaya={selectedWilaya} 
          onWilayaChange={onWilayaChange}
          ads={ads}
      />
      
      {/* Real Estate Hero */}
      <div className="bg-emerald-900 py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                  <circle id="pattern-circle" cx="10" cy="10" r="2" fill="currentColor"></circle>
                </pattern>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
              </svg>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10 text-center">
              <div className="inline-block p-3 rounded-full bg-emerald-800/50 mb-4 border border-emerald-700">
                  <Home className="w-8 h-8 text-emerald-300" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 tracking-tight">Find Your Dream Home</h1>
              <p className="text-emerald-200 text-lg mb-8 max-w-2xl mx-auto font-sans">Discover apartments, villas, and commercial properties across Algeria.</p>
              
              <div className="relative max-w-4xl mx-auto font-sans">
                <div className="bg-white p-4 rounded-lg shadow-2xl flex flex-col md:flex-row gap-4">
                  <div className="flex-1 bg-gray-50 rounded px-4 border border-gray-200">
                      <input
                        type="text"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={isFocused && suggestions.length > 0}
                        placeholder="City, Neighborhood..."
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
                        className="bg-transparent w-full py-3 focus:outline-none text-gray-900"
                      />
                  </div>
                  <div className="w-full md:w-48 bg-gray-50 rounded px-4 border border-gray-200">
                       <select className="bg-transparent w-full py-3 focus:outline-none text-gray-600" aria-label="Property type" title="Select property type">
                           <option>For Sale</option>
                           <option>For Rent</option>
                       </select>
                  </div>
                  <button onClick={() => setSearchParams(query.trim() ? { q: query.trim() } : {})} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded font-bold transition-colors">
                      Search
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

      <div className="max-w-7xl mx-auto px-4 py-12 font-sans">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">Featured Properties</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reAds.map(ad => (
                    <RealEstateCard key={ad.id} ad={ad} />
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

export default RealEstatePage;
