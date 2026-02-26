import { ArrowRight, Briefcase, Car, Home, Wrench } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  
  // Dynamic Text Effect
  const [dynamicText, setDynamicText] = useState('what you need');
  const phrases = ['what you need', 'Vehicle', 'Real Estate', 'Jobs', 'Services'];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % phrases.length;
      setDynamicText(phrases[index]);
    }, 2500); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-linear-to-br from-daberli-blue to-blue-800 py-16 sm:py-24">
      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute inset-0 hero-dot-pattern"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white mix-blend-overlay blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-daberli-green mix-blend-overlay blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 min-h-[3.5rem] sm:min-h-[4rem]">
          Find <span className="text-daberli-green transition-all duration-500">{dynamicText}</span> in Algeria
        </h1>
        <p className="text-blue-100 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
          The trusted marketplace for cars, homes, jobs, and skilled professionals.
        </p>

        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-100/80 mb-4">Browse by category</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link to="/auto" className="group flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-blue-200 hover:shadow-md hover:bg-blue-50/40 transition-all duration-200 text-left">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Vehicle</p>
                <p className="text-xs text-gray-400 truncate">Cars, trucks & motos</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 ml-auto shrink-0 transition-colors" />
            </Link>

            <Link to="/real-estate" className="group flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-emerald-200 hover:shadow-md hover:bg-emerald-50/40 transition-all duration-200 text-left">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200 shrink-0">
                <Home className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Real Estate</p>
                <p className="text-xs text-gray-400 truncate">Apartments & villas</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-400 ml-auto shrink-0 transition-colors" />
            </Link>

            <Link to="/jobs" className="group flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-purple-200 hover:shadow-md hover:bg-purple-50/40 transition-all duration-200 text-left">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-200 shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Jobs</p>
                <p className="text-xs text-gray-400 truncate">Careers & freelance</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-purple-400 ml-auto shrink-0 transition-colors" />
            </Link>

            <Link to="/services" className="group flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-orange-200 hover:shadow-md hover:bg-orange-50/40 transition-all duration-200 text-left">
              <div className="p-2 rounded-lg bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-200 shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Services</p>
                <p className="text-xs text-gray-400 truncate">Local pros & experts</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-orange-400 ml-auto shrink-0 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;