import { Zap, Wrench, Car, Home, Briefcase, ArrowRight } from 'lucide-react';
import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import FloatingActionBar from '../components/FloatingActionBar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import ServiceCard from '../components/cards/ServiceCard';
import AutoCard from '../components/cards/AutoCard';
import RealEstateCard from '../components/cards/RealEstateCard';
import JobCard from '../components/cards/JobCard';
import { Category } from '../types';
import { useAds } from '../contexts/AdsContext';
import { useAuth } from '../contexts/AuthContext';

interface HomePageProps {
  selectedWilaya: string;
  onWilayaChange: (wilaya: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  selectedWilaya,
  onWilayaChange,
}) => {
  const { ads, isLoading, error } = useAds();
  const { user, openAuthModal, handleSignOut, openPostAdModal } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') ?? '';
  const activeCategory = searchParams.get('category') as Category | 'all' || 'all';

  // Only show admin-boosted ads in the featured section
  const boostedAds = ads.filter((ad) => ad.isBoosted);

  // Category-organized boosted ads
  const categorySections = [
    { key: 'auto', label: 'Vehicles', icon: Car, ads: boostedAds.filter(ad => ad.category === 'auto'), Card: AutoCard, accent: 'bg-red-100 text-red-600' },
    { key: 'real-estate', label: 'Real Estate', icon: Home, ads: boostedAds.filter(ad => ad.category === 'real-estate'), Card: RealEstateCard, accent: 'bg-emerald-100 text-emerald-600' },
    { key: 'jobs', label: 'Jobs', icon: Briefcase, ads: boostedAds.filter(ad => ad.category === 'jobs'), Card: JobCard, accent: 'bg-blue-100 text-blue-600' },
    { key: 'services', label: 'Services', icon: Wrench, ads: boostedAds.filter(ad => ad.category === 'services'), Card: ServiceCard, accent: 'bg-violet-100 text-violet-600' },
  ];

  return (
    <div className="min-h-screen bg-brand-surface flex flex-col font-sans">
      <Navbar 
        selectedWilaya={selectedWilaya} 
        onWilayaChange={onWilayaChange} 
        user={user}
        onSignIn={openAuthModal}
        onSignOut={handleSignOut}
        onPostAd={openPostAdModal}
        ads={ads}
      />
      
      <main className="grow">
        <Hero />

        {isLoading && (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading listings...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-10">
            <p className="text-red-500">Error: {error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Cross-category search results */}
            {searchQuery && (() => {
              const q = searchQuery.toLowerCase();
              const results = ads.filter(ad =>
                (ad.title.toLowerCase().includes(q) ||
                ad.location.toLowerCase().includes(q) ||
                ad.category.toLowerCase().includes(q)) &&
                (activeCategory === 'all' || ad.category === activeCategory)
              );
              return (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        Results for &ldquo;<span className="text-apple-blue">{searchQuery}</span>&rdquo;
                      </h2>
                      <p className="text-sm text-slate-500 mt-1 font-medium">{results.length} listing{results.length !== 1 ? 's' : ''} found</p>
                    </div>
                    <button onClick={() => setSearchParams({})} className="text-sm font-bold text-apple-blue hover:underline">Clear search</button>
                  </div>
                  {results.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {results.map(ad => <ServiceCard key={ad.id} ad={ad} />)}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 rounded-2xl text-center">
                      <p className="text-gray-400 font-medium">No listings match &ldquo;{searchQuery}&rdquo;</p>
                      <button onClick={() => setSearchParams({})} className="mt-3 text-sm text-blue-600 hover:underline">Browse all listings</button>
                    </div>
                  )}
                </div>
              );
            })()}
            
            {/* Boosted / Sponsored Ads Section */}
            <div id="featured-listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-20 rounded-full" />
                    <div className="relative p-4 bg-white rounded-3xl shadow-sm border border-slate-100">
                      <Zap className="w-7 h-7 text-amber-500 fill-amber-500" />
                    </div>
                  </div>
                  <div>
                    <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">
                      Featured Listings
                    </h2>
                    <p className="text-slate-500 text-sm sm:text-lg mt-1 font-medium">
                      Hand-picked and promoted by <span className="font-bold text-apple-blue">Daberli</span>.
                    </p>
                  </div>
                </div>

                <Link
                  to="/boosted"
                  className="apple-button flex items-center gap-2 text-sm font-bold text-apple-blue bg-white px-6 py-3 rounded-full transition-all font-heading shadow-sm border border-slate-100 hover:shadow-md"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {boostedAds.length > 0 ? (
                <div className="space-y-16">
                  {categorySections.map(({ key, label, icon: Icon, ads: catAds, Card, accent }) =>
                    catAds.length > 0 ? (
                      <div key={key}>
                        <div className="flex items-center gap-3 mb-8">
                          <div className={`p-2.5 rounded-2xl ${accent} bg-opacity-10`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <h3 className="font-heading text-xl font-black text-slate-900 tracking-tight">{label}</h3>
                          <span className="text-xs font-bold text-slate-400 bg-white shadow-sm border border-slate-100 px-3 py-1 rounded-full">{catAds.length}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {catAds.map((ad) => (
                            <Card key={ad.id} ad={ad} />
                          ))}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                  <div className="p-4 bg-amber-50 rounded-2xl mb-4">
                    <Zap className="w-8 h-8 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">No Featured Ads Yet</h3>
                  <p className="text-sm text-gray-400">Admins can boost listings to appear here.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
      <FloatingActionBar 
        onHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onPostAd={openPostAdModal} 
        onProfile={user ? () => navigate('/profile') : openAuthModal}
      />
    </div>
  );
};

export default HomePage;
