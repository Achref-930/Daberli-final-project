import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ad } from '../../types';
import { MapPin, Clock, Briefcase, Building2, DollarSign } from 'lucide-react';

interface JobCardProps {
  ad: Ad;
}

const JobCard: React.FC<JobCardProps> = ({ ad }) => {
  const navigate = useNavigate();
  const goToDetail = () => navigate(`/ad/${ad.id}`);
  return (
    <div onClick={goToDetail} className="bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 p-5 flex flex-col h-full relative overflow-hidden cursor-pointer">
        { ad.isVerified && <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-bl from-blue-100 to-transparent -mr-8 -mt-8 rounded-bl-full"></div> }
        
        <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
                <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1 hover:underline cursor-pointer">{ad.title}</h3>
                <p className="text-sm text-slate-500 font-medium">{ad.details?.company || 'Confidential Company'}</p>
            </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                <Briefcase className="w-3 h-3 mr-1" />
                {ad.details?.jobType || 'Full-time'}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                <MapPin className="w-3 h-3 mr-1" />
                {ad.location}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                <DollarSign className="w-3 h-3 mr-1" />
                {ad.price > 0 ? `${ad.price.toLocaleString()} ${ad.currency}` : 'Negotiable'}
            </span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-dashed border-gray-200">
            <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {ad.datePosted}
            </span>
            <button onClick={goToDetail} className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                Apply Now &rarr;
            </button>
        </div>
    </div>
  );
};

export default JobCard;
