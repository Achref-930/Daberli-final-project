import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Star, ShieldCheck, Phone } from 'lucide-react';
import { Ad } from '../../types';
import BaseCard from './BaseCard';

interface ServiceCardProps {
  ad: Ad;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ ad }) => {
  const navigate = useNavigate();
  const goToDetail = () => navigate(`/ad/${ad.id}`);

  return (
    <BaseCard
      onClick={goToDetail}
      onActionClick={goToDetail}
      image={ad.image}
      title={ad.title}
      location={ad.location}
      category="Services"
      categoryIcon={<Wrench className="w-2.5 h-2.5" />}
      categoryColorClass="bg-violet-600"
      isBoosted={ad.isBoosted}
      actionLabel="Contact"
    >
      <div className="space-y-4">
        {/* Provider info row */}
        <div className="flex items-center gap-3 py-1">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(ad.title)}&background=7c3aed&color=fff&size=72`}
            alt={ad.title}
            className="w-12 h-12 rounded-2xl border-none shadow-sm shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-heading font-black text-sm text-slate-900">{ad.rating ?? 'New'}</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Expert Provider</p>
          </div>
          {ad.isVerified && (
            <div className="ml-auto bg-emerald-100 text-emerald-700 p-1.5 rounded-full" title="Verified Pro">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
          {ad.details?.description as string || 'Verified professional service in your area.'}
        </p>
      </div>
    </BaseCard>
  );
};

export default ServiceCard;
