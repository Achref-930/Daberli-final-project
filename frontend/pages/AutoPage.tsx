import { Car } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryPageLayout from '../components/CategoryPageLayout';
import AutoCard from '../components/cards/AutoCard';
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

const AutoPage: React.FC<CategoryPageProps> = ({
  user, onSignIn, onSignOut, onPostAdClick, ads, selectedWilaya, onWilayaChange,
}) => {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(urlQuery);
  useEffect(() => { setQuery(urlQuery); }, [urlQuery]);

  const filteredAds = ads.filter(ad =>
    ad.category === 'auto' &&
    (!selectedWilaya || ad.location === selectedWilaya) &&
    (!query || ad.title.toLowerCase().includes(query.toLowerCase()) || ad.location.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <CategoryPageLayout
      config={{
        variant: 'auto',
        icon: <Car className="w-7 h-7 text-white" />,
        title: 'Find Your Next Ride',
        subtitle: 'Browse cars, trucks, and motorcycles across all 58 wilayas of Algeria.',
        searchPlaceholder: 'Make, model, or year…',
        accentBg: 'bg-red-600',
        accentHover: 'hover:bg-red-700',
        gradientFrom: 'from-slate-800',
        gradientTo: 'to-slate-900',
        filterOptions: [
          { label: 'All Types', value: '' },
          { label: 'Car',        value: 'car' },
          { label: 'Truck',      value: 'truck' },
          { label: 'Motorcycle', value: 'moto' },
        ],
        filterLabel: 'Vehicle type',
        filterAriaLabel: 'Filter by vehicle type',
        ctaLabel: 'Search Cars',
      }}
      user={user}
      onSignIn={onSignIn}
      onSignOut={onSignOut}
      onPostAd={onPostAdClick}
      ads={ads}
      selectedWilaya={selectedWilaya}
      onWilayaChange={onWilayaChange}
      filteredAds={filteredAds}
      renderCard={(ad) => <AutoCard key={ad.id} ad={ad} />}
      gridHeading="Latest Listings"
      query={query}
      onQueryChange={setQuery}
    />
  );
};

export default AutoPage;
