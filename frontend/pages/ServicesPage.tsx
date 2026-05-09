import { Wrench } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryPageLayout from '../components/CategoryPageLayout';
import ServiceCard from '../components/cards/ServiceCard';
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

const ServicesPage: React.FC<CategoryPageProps> = ({
  user, onSignIn, onSignOut, onPostAdClick, ads, selectedWilaya, onWilayaChange,
}) => {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(urlQuery);
  useEffect(() => { setQuery(urlQuery); }, [urlQuery]);

  const filteredAds = ads.filter(ad =>
    ad.category === 'services' &&
    (!selectedWilaya || ad.location === selectedWilaya) &&
    (!query || ad.title.toLowerCase().includes(query.toLowerCase()) || ad.location.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <CategoryPageLayout
      config={{
        variant: 'services',
        icon: <Wrench className="w-7 h-7 text-white" />,
        title: 'Hire Great Pros',
        subtitle: 'From plumbers to designers — find the right verified professional near you.',
        searchPlaceholder: 'Service type, expert name…',
        accentBg: 'bg-violet-600',
        accentHover: 'hover:bg-violet-700',
        gradientFrom: 'from-violet-800',
        gradientTo: 'to-purple-900',
        filterOptions: [
          { label: 'All Services', value: '' },
          { label: 'Plumbing',     value: 'plumbing' },
          { label: 'Electrical',   value: 'electrical' },
          { label: 'Moving',       value: 'moving' },
          { label: 'Design',       value: 'design' },
        ],
        filterLabel: 'Service type',
        filterAriaLabel: 'Filter by service type',
        ctaLabel: 'Find Pros',
      }}
      user={user}
      onSignIn={onSignIn}
      onSignOut={onSignOut}
      onPostAd={onPostAdClick}
      ads={ads}
      selectedWilaya={selectedWilaya}
      onWilayaChange={onWilayaChange}
      filteredAds={filteredAds}
      renderCard={(ad) => <ServiceCard key={ad.id} ad={ad} />}
      gridHeading="Local Professionals"
      query={query}
      onQueryChange={setQuery}
    />
  );
};

export default ServicesPage;
