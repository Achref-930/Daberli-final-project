import { Zap, Wrench, Car, Home, Briefcase } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingActionBar from '../components/FloatingActionBar';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ServiceCard from '../components/cards/ServiceCard';
import AutoCard from '../components/cards/AutoCard';
import RealEstateCard from '../components/cards/RealEstateCard';
import JobCard from '../components/cards/JobCard';
import { useAds } from '../contexts/AdsContext';
import { useAuth } from '../contexts/AuthContext';
import { User, Ad } from '../types';

interface BoostedPageProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onPostAdClick: () => void;
  ads: Ad[];
  selectedWilaya: string;
  onWilayaChange: (wilaya: string) => void;
}

const BoostedPage: React.FC<BoostedPageProps> = ({
  user,
  onSignIn,
  onSignOut,
  onPostAdClick,
  ads,
  selectedWilaya,
  onWilayaChange,
}) => {
  const { isLoading, error } = useAds();
  const navigate = useNavigate();

  const boostedAds = ads.filter((ad) => ad.isBoosted);

  const categorySections = [
    { key: 'auto', label: 'Vehicles', icon: Car, ads: boostedAds.filter(ad => ad.category === 'auto'), Card: AutoCard, accent: 'bg-red-100 text-red-600' },
    { key: 'real-estate', label: 'Real Estate', icon: Home, ads: boostedAds.filter(ad => ad.category === 'real-estate'), Card: RealEstateCard, accent: 'bg-emerald-100 text-emerald-600' },
    { key: 'jobs', label: 'Jobs', icon: Briefcase, ads: boostedAds.filter(ad => ad.category === 'jobs'), Card: JobCard, accent: 'bg-blue-100 text-blue-600' },
    { key: 'services', label: 'Services', icon: Wrench, ads: boostedAds.filter(ad => ad.category === 'services'), Card: ServiceCard, accent: 'bg-violet-100 text-violet-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar 
        selectedWilaya={selectedWilaya} 
        onWilayaChange={onWilayaChange} 
        user={user}
        onSignIn={onSignIn}
        onSignOut={onSignOut}
        onPostAd={onPostAdClick}
        ads={ads}
        showBackButton
        forceScrolled
      />
      
      <main className="grow pt-20 md:pt-24">
        <div className="bg-linear-to-b from-amber-50 to-gray-50 py-12 border-b border-amber-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-2xl mb-4 animate-pulse">
              <Zap className="w-8 h-8 text-amber-500 fill-current" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl font-heading">
              Boosted <span className="text-amber-600">Listings</span>
            </h1>
            <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
              Premium listings hand-picked and promoted by Daberli for maximum visibility.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {isLoading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading featured listings...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20 bg-white rounded-2xl border border-red-100">
              <p className="text-red-500 font-medium">Error: {error}</p>
              <button onClick={() => window.location.reload()} className="mt-4 text-blue-600 hover:underline">Try again</button>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {boostedAds.length > 0 ? (
                <div className="space-y-16">
                  {categorySections.map(({ key, label, icon: Icon, ads: catAds, Card, accent }) =>
                    catAds.length > 0 ? (
                      <div key={key}>
                        <div className="flex items-center gap-4 mb-8">
                          <div className={`p-3 rounded-2xl ${accent} shadow-sm`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">{label}</h2>
                            <p className="text-sm text-gray-500">{catAds.length} boosted listing{catAds.length !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                          {catAds.map((ad) => (
                            <Card key={ad.id || ad._id} ad={ad} />
                          ))}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white shadow-sm">
                  <div className="p-6 bg-amber-50 rounded-3xl mb-6">
                    <Zap className="w-12 h-12 text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Boosted Ads Yet</h3>
                  <p className="text-gray-500 max-w-sm">
                    Boosted ads appear here and at the top of search results. Boost your ad today to stand out!
                  </p>
                  <button 
                    onClick={() => navigate('/my-ads')}
                    className="mt-8 bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-amber-200 active:scale-95"
                  >
                    Go to My Ads
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
      <FloatingActionBar 
        onHome={() => navigate('/')}
        onPostAd={onPostAdClick} 
        onProfile={user ? () => navigate('/profile') : onSignIn}
      />
    </div>
  );
};

export default BoostedPage;
