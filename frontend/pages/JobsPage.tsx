import { Briefcase, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import FloatingActionBar from '../components/FloatingActionBar';
import Navbar from '../components/Navbar';
import SearchSuggestions from '../components/SearchSuggestions';
import JobCard from '../components/cards/JobCard';
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

const JobsPage: React.FC<CategoryPageProps> = ({ user, onSignIn, onSignOut, onPostAdClick, ads, selectedWilaya, onWilayaChange }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(urlQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [suggIdx, setSuggIdx] = useState(-1);
  useEffect(() => { setQuery(urlQuery); }, [urlQuery]);
  const suggestions = useSearchSuggestions(query, ads, 'jobs');
  const jobAds = ads.filter(ad =>
    ad.category === 'jobs' &&
    (!selectedWilaya || ad.location === selectedWilaya) &&
    (!query || ad.title.toLowerCase().includes(query.toLowerCase()) || (ad.details?.company as string || '').toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
          user={user} 
          onSignIn={onSignIn} 
          onSignOut={onSignOut} 
          onPostAd={onPostAdClick} 
          variant="jobs"
          selectedWilaya={selectedWilaya} 
          onWilayaChange={onWilayaChange}
          ads={ads}
      />
      
      {/* Jobs Hero */}
      <div className="bg-blue-900 py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <pattern id="pattern-jobs" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="2" fill="currentColor"></circle>
                </pattern>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-jobs)"></rect>
              </svg>
          </div>

          <div className="max-w-7xl mx-auto relative z-10 text-center">
              <div className="inline-block p-3 rounded-full bg-blue-800/50 mb-4 border border-blue-700">
                  <Briefcase className="w-8 h-8 text-blue-300" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Build Your Career</h1>
              <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">Thousands of jobs across all industries and 58 wilayas of Algeria.</p>

              <div className="relative max-w-4xl mx-auto">
                <div className="bg-white p-4 rounded-lg shadow-2xl flex flex-col md:flex-row gap-4">
                  <div className="flex-1 bg-gray-50 rounded px-4 border border-gray-200 flex items-center gap-2">
                      <Search className="w-5 h-5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={isFocused && suggestions.length > 0}
                        placeholder="Job title, keywords..."
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
                      <select className="bg-transparent w-full py-3 focus:outline-none text-gray-600" aria-label="Job type filter">
                          <option>All Types</option>
                          <option>Full-Time</option>
                          <option>Part-Time</option>
                          <option>Remote</option>
                          <option>Freelance</option>
                      </select>
                  </div>
                  <button onClick={() => setSearchParams(query.trim() ? { q: query.trim() } : {})} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-bold transition-colors">
                      Find Jobs
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

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
            {/* Sidebar (Optional) */}
            <div className="hidden lg:block w-64 shrink-0 space-y-6">
                <div>
                   <h3 className="font-bold text-slate-900 mb-3">Job Type</h3>
                   <div className="space-y-2">
                       {['Full-time', 'Part-time', 'Freelance', 'Remote'].map(t => (
                           <label key={t} className="flex items-center gap-2 text-slate-600">
                               <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                               {t}
                           </label>
                       ))}
                   </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                     <p className="text-sm text-slate-500">Showing <span className="font-bold text-slate-900">{jobAds.length}</span> jobs</p>
                     <select className="border border-gray-300 rounded px-2 py-1 text-sm" aria-label="Sort jobs by">
                         <option>Newest First</option>
                         <option>Salary: High to Low</option>
                     </select>
                </div>
                <div className="space-y-4">
                    {jobAds.map(ad => (
                        <div className="h-42" key={ad.id}> 
                            {/* Reusing JobCard here. Grid vs List view could be toggled, using Grid for now as the Card is designed as a block */}
                             <JobCard ad={ad} />
                        </div>
                    ))}
                </div>
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

export default JobsPage;
