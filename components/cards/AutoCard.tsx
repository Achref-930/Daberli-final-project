import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ad } from '../../types';
import { Camera, Car, Fuel, Gauge, MapPin } from 'lucide-react';

interface AutoCardProps {
  ad: Ad;
}

const AutoCard: React.FC<AutoCardProps> = ({ ad }) => {
  const navigate = useNavigate();
  const goToDetail = () => navigate(`/ad/${ad.id}`);
  return (
    <div onClick={goToDetail} className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img 
          src={ad.image} 
          alt={ad.title} 
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-900 border border-white/20 shadow-sm">
          {ad.datePosted}
        </div>
        {ad.isVerified && (
           <div className="absolute top-3 left-3 bg-blue-600 text-white p-1 rounded-full shadow-lg">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
               <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.751zM11 8a1 1 0 11-2 0 1 1 0 012 0zm-1-4a1 1 0 00-1 1v3a1 1 0 002 0V5a1 1 0 00-1-1z" clipRule="evenodd" />
             </svg>
           </div>
        )}
        {ad.images && ad.images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            <Camera className="w-3 h-3" /> {ad.images.length}
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-red-600 transition-colors">{ad.title}</h3>
        </div>
        
        <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
          <MapPin className="w-3.5 h-3.5" />
          <span>{ad.location}</span>
        </div>

        {/* Auto Specific Details Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-slate-50 rounded-lg p-2 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-700">{ad.details?.mileage || 'N/A'} km</span>
            </div>
            <div className="bg-slate-50 rounded-lg p-2 flex items-center gap-2">
                <Fuel className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-700">{ad.details?.fuelType || 'Gas'}</span>
            </div>
            <div className="bg-slate-50 rounded-lg p-2 flex items-center gap-2 col-span-2">
                <Car className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-700">{ad.details?.transmission || 'Manual'} • {ad.details?.year || '2020'}</span>
            </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xl font-bold text-slate-900">{ad.price.toLocaleString()} {ad.currency}</span>
          <button onClick={goToDetail} className="text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoCard;
