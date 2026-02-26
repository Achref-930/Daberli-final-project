import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, BadgeCheck, Star, Heart, Zap } from 'lucide-react';
import { handleImgError } from '../constants';
import { Ad } from '../types';

interface ServiceCardProps {
  ad: Ad;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ ad }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/ad/${ad.id}`)}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img 
          src={ad.image} 
          alt={ad.title} 
          onError={handleImgError}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {ad.isBoosted && (
            <div className="bg-amber-400 px-2 py-1 rounded-full flex items-center space-x-1 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-amber-900 fill-current" />
              <span className="text-xs font-bold text-amber-900">Sponsored</span>
            </div>
          )}
          {ad.isVerified && (
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1 shadow-sm">
              <BadgeCheck className="w-4 h-4 text-daberli-green fill-current" />
              <span className="text-xs font-bold text-daberli-blue">Verified</span>
            </div>
          )}
        </div>
        <div className="absolute top-3 right-3 flex gap-2 z-10">
            <button className="p-1.5 bg-white/50 hover:bg-white rounded-full text-white hover:text-red-500 transition-all shadow-sm backdrop-blur-md">
                <Heart className="w-4 h-4" />
            </button>
            <div className="bg-daberli-blue text-white text-xs font-bold px-2 py-1.5 rounded-md shadow-sm">
                {ad.category.toUpperCase()}
            </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-daberli-blue transition-colors">
            {ad.title}
          </h3>
          {ad.rating && (
            <div className="flex items-center bg-yellow-50 px-1.5 py-0.5 rounded text-yellow-700">
              <Star className="w-3 h-3 fill-current mr-1" />
              <span className="text-xs font-bold">{ad.rating}</span>
            </div>
          )}
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1 shrink-0" />
          <span className="truncate">{ad.location}</span>
        </div>

        {/* Dynamic Details based on Ad */}
        {ad.details && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(ad.details).map(([key, value]) => (
              <span key={key} className="inline-block bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded border border-gray-200">
                {key}: {value}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img 
                src={`https://ui-avatars.com/api/?name=${ad.title.split(' ')[0]}&background=random`} 
                alt="Seller" 
                className="w-8 h-8 rounded-full border border-gray-100"
            />
            <div>
                <span className="block text-xs text-gray-400 font-medium">Price</span>
                <span className="text-lg font-bold text-daberli-blue">
                {ad.price.toLocaleString()} <span className="text-sm font-normal text-gray-600">{ad.currency}</span>
                </span>
            </div>
          </div>
          <span className="text-xs text-gray-400">{ad.datePosted}</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;