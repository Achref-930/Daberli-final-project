import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleImgError } from '../../constants';
import { Ad } from '../../types';
import { Bath, BedDouble, Camera, MapPin, Square } from 'lucide-react';

interface RealEstateCardProps {
  ad: Ad;
}

const RealEstateCard: React.FC<RealEstateCardProps> = ({ ad }) => {
  const navigate = useNavigate();
  const goToDetail = () => navigate(`/ad/${ad.id}`);
  return (
    <div onClick={goToDetail} className="group bg-white rounded-none border-b-4 border-emerald-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={ad.image} 
          alt={ad.title} 
          loading="lazy"
          decoding="async"
          onError={handleImgError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4">
             <div className="flex justify-between items-end text-white">
                <div>
                   <span className="text-2xl font-bold block shadow-black drop-shadow-md">{ad.price.toLocaleString()} {ad.currency}</span>
                    <div className="flex items-center gap-1 text-emerald-300 text-sm font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{ad.location}</span>
                    </div>
                </div>
             </div>
        </div>
        <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
            {ad.details?.type || 'For Sale'}
        </div>
        {ad.images && ad.images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            <Camera className="w-3 h-3" /> {ad.images.length}
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-serif font-bold text-xl text-slate-800 mb-4 group-hover:text-emerald-700 transition-colors">{ad.title}</h3>
        
        {/* Real Estate Specs */}
        <div className="flex justify-between items-center py-3 border-t border-b border-gray-100 mb-4">
            <div className="flex flex-col items-center px-2">
                <BedDouble className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs font-bold text-slate-700">{ad.details?.bedrooms || '-'} Beds</span>
            </div>
            <div className="w-px h-8 bg-gray-100"></div>
            <div className="flex flex-col items-center px-2">
                <Bath className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs font-bold text-slate-700">{ad.details?.bathrooms || '-'} Baths</span>
            </div>
            <div className="w-px h-8 bg-gray-100"></div>
            <div className="flex flex-col items-center px-2">
                <Square className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs font-bold text-slate-700">{ad.details?.area || '-'} m²</span>
            </div>
        </div>

        <div className="mt-auto flex items-center justify-between">
            <span className="text-xs text-slate-400">Added {ad.datePosted}</span>
             <button onClick={goToDetail} className="bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white px-4 py-2 text-sm font-semibold transition-colors duration-300">
                Contact Agent
             </button>
        </div>
      </div>
    </div>
  );
};

export default RealEstateCard;
