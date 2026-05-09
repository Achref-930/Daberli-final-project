import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BedDouble, Bath, Square } from 'lucide-react';
import { Ad } from '../../types';
import BaseCard from './BaseCard';

interface RealEstateCardProps {
  ad: Ad;
}

const RealEstateCard: React.FC<RealEstateCardProps> = ({ ad }) => {
  const navigate = useNavigate();
  const goToDetail = () => navigate(`/ad/${ad.id}`);

  return (
    <BaseCard
      onClick={goToDetail}
      onActionClick={goToDetail}
      image={ad.image}
      title={ad.title}
      location={ad.location}
      category="Real Estate"
      categoryIcon={<Home className="w-2.5 h-2.5" />}
      categoryColorClass="bg-emerald-600"
      isBoosted={ad.isBoosted}
      photoCount={ad.images?.length}
      price={ad.price}
      currency={ad.currency}
      actionLabel="View"
    >
      <div className="flex items-center gap-2 py-2.5 my-2">
        <div className="flex flex-col items-center flex-1 bg-slate-50 rounded-2xl py-2">
          <BedDouble className="w-4 h-4 text-slate-400 mb-1" />
          <span className="text-[11px] font-black text-slate-800">{ad.details?.bedrooms ?? '—'}</span>
        </div>
        <div className="flex flex-col items-center flex-1 bg-slate-50 rounded-2xl py-2">
          <Bath className="w-4 h-4 text-slate-400 mb-1" />
          <span className="text-[11px] font-black text-slate-800">{ad.details?.bathrooms ?? '—'}</span>
        </div>
        <div className="flex flex-col items-center flex-1 bg-slate-50 rounded-2xl py-2">
          <Square className="w-4 h-4 text-slate-400 mb-1" />
          <span className="text-[11px] font-black text-slate-800">{ad.details?.area ?? '—'}m²</span>
        </div>
      </div>
    </BaseCard>
  );
};

export default RealEstateCard;
