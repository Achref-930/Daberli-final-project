import { Info } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingActionBar from '../components/FloatingActionBar';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { AboutResponse, legalAPI } from '../services/api';
import { Ad, User } from '../types';

interface AboutPageProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onPostAdClick: () => void;
  ads: Ad[];
  selectedWilaya: string;
  onWilayaChange: (wilaya: string) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({
  user,
  onSignIn,
  onSignOut,
  onPostAdClick,
  ads,
  selectedWilaya,
  onWilayaChange,
}) => {
  const navigate = useNavigate();
  const [about, setAbout] = useState<AboutResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadAbout = async () => {
      try {
        const data = await legalAPI.getAbout();
        if (mounted) setAbout(data);
      } catch (err: any) {
        if (mounted) setError(err.message || 'Failed to load about page.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadAbout();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        user={user}
        onSignIn={onSignIn}
        onSignOut={onSignOut}
        onPostAd={onPostAdClick}
        selectedWilaya={selectedWilaya}
        onWilayaChange={onWilayaChange}
        ads={ads}
      />

      <main className="grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <div className="flex items-start sm:items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">About Us</h1>
                {!loading && !error && about && (
                  <p className="text-sm text-gray-500 mt-1">{about.subtitle}</p>
                )}
              </div>
            </div>

            {loading && <p className="text-sm text-gray-500">Loading about page...</p>}

            {!loading && error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            {!loading && !error && about && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {about.stats.map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  {about.sections.map((section) => (
                    <section key={section.heading} className="border-t border-gray-100 pt-5 first:border-t-0 first:pt-0">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">{section.heading}</h2>
                      <p className="text-sm text-gray-600 leading-relaxed">{section.body}</p>
                    </section>
                  ))}
                </div>
              </div>
            )}
          </div>
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

export default AboutPage;