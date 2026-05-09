import { Briefcase } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryPageLayout from '../components/CategoryPageLayout';
import JobCard from '../components/cards/JobCard';
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

// Sidebar filter content (desktop only)
const JobSidebar: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h3 className="font-heading font-bold text-slate-900 mb-3 text-sm uppercase tracking-wide">Job Type</h3>
      <div className="space-y-2">
        {['Full-time', 'Part-time', 'Freelance', 'Remote'].map((t) => (
          <label key={t} className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer hover:text-slate-900">
            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" />
            {t}
          </label>
        ))}
      </div>
    </div>
    <div>
      <h3 className="font-heading font-bold text-slate-900 mb-3 text-sm uppercase tracking-wide">Experience</h3>
      <div className="space-y-2">
        {['Entry Level', 'Mid Level', 'Senior', 'Executive'].map((t) => (
          <label key={t} className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer hover:text-slate-900">
            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" />
            {t}
          </label>
        ))}
      </div>
    </div>
  </div>
);

const JobsPage: React.FC<CategoryPageProps> = ({
  user, onSignIn, onSignOut, onPostAdClick, ads, selectedWilaya, onWilayaChange,
}) => {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(urlQuery);
  useEffect(() => { setQuery(urlQuery); }, [urlQuery]);

  const filteredAds = ads.filter(ad =>
    ad.category === 'jobs' &&
    (!selectedWilaya || ad.location === selectedWilaya) &&
    (!query ||
      ad.title.toLowerCase().includes(query.toLowerCase()) ||
      (ad.details?.company as string || '').toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <CategoryPageLayout
      config={{
        variant: 'jobs',
        icon: <Briefcase className="w-7 h-7 text-white" />,
        title: 'Build Your Career',
        subtitle: 'Thousands of jobs across all industries and 58 wilayas of Algeria.',
        searchPlaceholder: 'Job title, keywords, or company…',
        accentBg: 'bg-blue-600',
        accentHover: 'hover:bg-blue-700',
        gradientFrom: 'from-blue-800',
        gradientTo: 'to-indigo-900',
        filterOptions: [
          { label: 'All Types',  value: '' },
          { label: 'Full-Time',  value: 'full' },
          { label: 'Part-Time',  value: 'part' },
          { label: 'Remote',     value: 'remote' },
          { label: 'Freelance',  value: 'freelance' },
        ],
        filterLabel: 'Job type',
        filterAriaLabel: 'Filter by job type',
        ctaLabel: 'Find Jobs',
      }}
      user={user}
      onSignIn={onSignIn}
      onSignOut={onSignOut}
      onPostAd={onPostAdClick}
      ads={ads}
      selectedWilaya={selectedWilaya}
      onWilayaChange={onWilayaChange}
      filteredAds={filteredAds}
      renderCard={(ad) => <JobCard key={ad.id} ad={ad} />}
      gridHeading={`${filteredAds.length} Jobs Found`}
      query={query}
      onQueryChange={setQuery}
    />
  );
};

export default JobsPage;
