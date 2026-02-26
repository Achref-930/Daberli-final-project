import React from 'react';
import { Home, Search, PlusCircle, Heart, User } from 'lucide-react';

interface FloatingActionBarProps {
  onHome: () => void;
  onPostAd: () => void;
  onProfile: () => void;
}

const FloatingActionBar: React.FC<FloatingActionBarProps> = ({ onHome, onPostAd, onProfile }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-200 px-6 py-3 md:hidden shadow-lg safe-area-pb">
      <div className="flex justify-between items-end max-w-sm mx-auto text-xs font-medium text-gray-500">
        <button onClick={onHome} className="flex flex-col items-center gap-1 hover:text-daberli-blue transition-colors w-16">
          <Home className="w-6 h-6" />
          <span>Home</span>
        </button>
        
        <button className="flex flex-col items-center gap-1 hover:text-daberli-blue transition-colors w-16">
          <Heart className="w-6 h-6" />
          <span>Saved</span>
        </button>
        
        <button 
            onClick={onPostAd}
            className="flex flex-col items-center justify-end -mt-8 group relative"
        >
          <div className="bg-daberli-green text-white p-3.5 rounded-full shadow-xl shadow-daberli-green/30 transform group-hover:-translate-y-1 transition-all duration-300 border-4 border-gray-50">
            <PlusCircle className="w-7 h-7" strokeWidth={2.5} />
          </div>
          <span className="mt-1 font-bold text-daberli-green">Post</span>
        </button>

        <button className="flex flex-col items-center gap-1 hover:text-daberli-blue transition-colors w-16">
          <Search className="w-6 h-6" />
          <span>Search</span>
        </button>

        <button onClick={onProfile} className="flex flex-col items-center gap-1 hover:text-daberli-blue transition-colors w-16">
          <User className="w-6 h-6" />
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
};

export default FloatingActionBar;
