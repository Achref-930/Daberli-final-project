import { Home } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryPageLayout from '../components/CategoryPageLayout';
import RealEstateCard from '../components/cards/RealEstateCard';
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

const RealEstatePage: React.FC<CategoryPageProps> = ({
  user, onSignIn, onSignOut, onPostAdClick, ads, selectedWilaya, onWilayaChange,
}) => {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(urlQuery);
  useEffect(() => { setQuery(urlQuery); }, [urlQuery]);

  const filteredAds = ads.filter(ad =>
    ad.category === 'real-estate' &&
    (!selectedWilaya || ad.location === selectedWilaya) &&
    (!query || ad.title.toLowerCase().includes(query.toLowerCase()) || ad.location.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <CategoryPageLayout
      config={{
        variant: 'real-estate',
        icon: <Home className="w-7 h-7 text-white" />,
        title: 'Find Your Dream Home',
        subtitle: 'Discover apartments, villas, and commercial properties across Algeria.',
        searchPlaceholder: 'City, neighborhood, or property type…',
        accentBg: 'bg-emerald-600',
        accentHover: 'hover:bg-emerald-700',
        gradientFrom: 'from-emerald-800',
        gradientTo: 'to-teal-900',
        filterOptions: [
          { label: 'For Sale',    value: 'sale' },
          { label: 'For Rent',   value: 'rent' },
        ],
        filterLabel: 'Listing type',
        filterAriaLabel: 'Filter by sale or rent',
        ctaLabel: 'Search Properties',
      }}
      user={user}
      onSignIn={onSignIn}
      onSignOut={onSignOut}
      onPostAd={onPostAdClick}
      ads={ads}
      selectedWilaya={selectedWilaya}
      onWilayaChange={onWilayaChange}
      filteredAds={filteredAds}
      renderCard={(ad) => <RealEstateCard key={ad.id} ad={ad} />}
      gridHeading="Featured Properties"
      query={query}
      onQueryChange={setQuery}
    />
  );
};

export default RealEstatePage;
