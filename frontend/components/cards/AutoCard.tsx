import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Gauge, Fuel } from 'lucide-react';
import { Ad } from '../../types';
import BaseCard from './BaseCard';

interface AutoCardProps {
  ad: Ad;
}

const AutoCard: React.FC<AutoCardProps> = ({ ad }) => {
  const navigate = useNavigate();
  const goToDetail = () => navigate(`/ad/${ad.id}`);

  return (
    <BaseCard
      onClick={goToDetail}
      onActionClick={goToDetail}
      image={ad.image}
      title={ad.title}
      location={ad.location}
      category="Vehicles"
      categoryIcon={<Car className="w-2.5 h-2.5" />}
      categoryColorClass="bg-red-600"
      isBoosted={ad.isBoosted}
      photoCount={ad.images?.length}
      price={ad.price}
      currency={ad.currency}
      actionLabel="Details"
    >
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="bg-slate-50 rounded-xl p-2 flex items-center gap-2">
          <Gauge className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-700 font-bold truncate">{ad.details?.mileage ?? 'N/A'} km</span>
        </div>
        <div className="bg-slate-50 rounded-xl p-2 flex items-center gap-2">
          <Fuel className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-700 font-bold truncate">{ad.details?.fuelType ?? 'Gas'}</span>
        </div>
        <div className="bg-slate-50 rounded-xl p-2 flex items-center gap-2 col-span-2">
          <Car className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-700 font-bold truncate">
            {ad.details?.transmission ?? 'Manual'} · {ad.details?.year ?? '—'}
          </span>
        </div>
      </div>
    </BaseCard>
  );
};

export default AutoCard;
