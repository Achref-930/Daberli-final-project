import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleImgError } from '../../constants';
import { Ad } from '../../types';
import { MapPin, Star, ShieldCheck, Phone } from 'lucide-react';

interface ServiceCardProps {
  ad: Ad;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ ad }) => {
  const navigate = useNavigate();
  const goToDetail = () => navigate(`/ad/${ad.id}`);
  return (
    <div onClick={goToDetail} className="flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer">
      <div className="relative h-32 bg-slate-900">
         <img src={ad.image} className="w-full h-full object-cover opacity-60" alt="Service Cover" loading="lazy" decoding="async" onError={handleImgError} />
         <div className="absolute -bottom-10 left-6">
            <img 
               src={`https://ui-avatars.com/api/?name=${ad.title}&background=random`} 
               alt="Pro" 
               className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-white"
            />
         </div>
      </div>
      
      <div className="pt-12 px-6 pb-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
             <h3 className="font-bold text-lg text-slate-900">{ad.title}</h3>
              {ad.isVerified && (
                 <div className="bg-violet-100 text-violet-700 p-1 rounded-full" title="Verified Pro">
                    <ShieldCheck className="w-4 h-4" />
                 </div>
              )}
          </div>
          <p className="text-sm text-slate-500 mb-4 line-clamp-2">{ad.details?.description || 'No description provided.'}</p>

          <div className="flex items-center gap-1 mb-4">
             <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
             <span className="font-bold text-slate-900">{ad.rating || 'New'}</span>
             <span className="text-slate-400 text-sm">({ad.details?.reviews || 0} reviews)</span>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-1 text-slate-500 text-xs">
                <MapPin className="w-3.5 h-3.5" />
                {ad.location}
              </div>
              <button onClick={goToDetail} className="bg-violet-600 hover:bg-violet-700 text-white p-2 rounded-lg transition-colors shadow-lg shadow-violet-200">
                 <Phone className="w-4 h-4" />
              </button>
          </div>
      </div>
    </div>
  );
};

export default ServiceCard;
