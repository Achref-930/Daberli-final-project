import { Search, Wrench } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import FloatingActionBar from '../components/FloatingActionBar';
import Navbar from '../components/Navbar';
import SearchSuggestions from '../components/SearchSuggestions';
import ServiceCard from '../components/cards/ServiceCard';
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

const ServicesPage: React.FC<CategoryPageProps> = ({ user, onSignIn, onSignOut, onPostAdClick, ads, selectedWilaya, onWilayaChange }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(urlQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [suggIdx, setSuggIdx] = useState(-1);
  useEffect(() => { setQuery(urlQuery); }, [urlQuery]);
  const suggestions = useSearchSuggestions(query, ads, 'services');
  const serviceAds = ads.filter(ad =>
    ad.category === 'services' &&
    (!selectedWilaya || ad.location === selectedWilaya) &&
    (!query || ad.title.toLowerCase().includes(query.toLowerCase()) || ad.location.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-violet-50/50">
      <Navbar 
          user={user} 
          onSignIn={onSignIn} 
          onSignOut={onSignOut} 
          onPostAd={onPostAdClick} 
          variant="services"
          selectedWilaya={selectedWilaya} 
          onWilayaChange={onWilayaChange}
          ads={ads}
      />
      
      {/* Services Hero */}
      <div className="bg-violet-900 py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <pattern id="pattern-services" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="2" fill="currentColor"></circle>
                </pattern>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-services)"></rect>
              </svg>
          </div>

          <div className="max-w-7xl mx-auto relative z-10 text-center">
              <div className="inline-block p-3 rounded-full bg-violet-800/50 mb-4 border border-violet-700">
                  <Wrench className="w-8 h-8 text-violet-300" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Hire Great Pros</h1>
              <p className="text-violet-200 text-lg mb-8 max-w-2xl mx-auto">From plumbers to designers, find the right verified professional.</p>

              <div className="relative max-w-4xl mx-auto">
                <div className="bg-white p-4 rounded-lg shadow-2xl flex flex-col md:flex-row gap-4">
                  <div className="flex-1 bg-gray-50 rounded px-4 border border-gray-200 flex items-center gap-2">
                      <Search className="w-5 h-5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={isFocused && suggestions.length > 0}
                        placeholder="Service, expert name..."
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
                      <label htmlFor="service-filter" className="sr-only">Filter by service type</label>
                      <select id="service-filter" title="Filter by service type" className="bg-transparent w-full py-3 focus:outline-none text-gray-600">
                          <option>All Services</option>
                          <option>Plumbing</option>
                          <option>Electrical</option>
                          <option>Moving</option>
                          <option>Design</option>
                      </select>
                  </div>
                  <button onClick={() => setSearchParams(query.trim() ? { q: query.trim() } : {})} className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded font-bold transition-colors">
                      Find Pros
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

      <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {serviceAds.map(ad => (
                    <ServiceCard key={ad.id} ad={ad} />
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

export default ServicesPage;
