import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Building2, Clock } from 'lucide-react';
import { Ad } from '../../types';
import BaseCard from './BaseCard';

interface JobCardProps {
  ad: Ad;
}

const JobCard: React.FC<JobCardProps> = ({ ad }) => {
  const navigate = useNavigate();
  const goToDetail = () => navigate(`/ad/${ad.id}`);

  return (
    <BaseCard
      onClick={goToDetail}
      onActionClick={goToDetail}
      image={ad.image}
      photoCount={ad.images?.length}
      title={ad.title}
      location={ad.location}
      category="Jobs"
      categoryIcon={<Briefcase className="w-2.5 h-2.5" />}
      categoryColorClass="bg-blue-600"
      isBoosted={ad.isBoosted}
      price={ad.price > 0 ? ad.price : 'Negotiable'}
      currency={ad.price > 0 ? ad.currency : ''}
      actionLabel="Apply"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
          <Building2 className="w-6 h-6 text-apple-blue" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black text-slate-800 truncate">
            {ad.details?.company as string || 'Confidential'}
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <Clock className="w-3 h-3" />
            <span>{ad.datePosted}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="badge bg-apple-blue/10 text-apple-blue">
          {ad.details?.jobType as string || 'Full-time'}
        </span>
      </div>
    </BaseCard>
  );
};

export default JobCard;
