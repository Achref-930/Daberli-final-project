import { Camera, MapPin, Zap, Heart } from 'lucide-react';
import { handleImgError } from '../../constants';

interface BaseCardProps {
  image?: string;
  imageAlt?: string;
  category: string;
  categoryIcon: React.ReactNode;
  categoryColorClass: string; // e.g. 'bg-red-600'
  isBoosted?: boolean;
  boostedLabel?: string;
  photoCount?: number;
  title: string;
  location: string;
  price?: string | number;
  currency?: string;
  actionLabel: string;
  onActionClick: (e: React.MouseEvent) => void;
  onClick: () => void;
  children: React.ReactNode; // For the specific details grid/row
  actionColorClass?: string; // e.g. 'text-red-600 border-red-200 hover:bg-red-600 hover:text-white'
}

const BaseCard: React.FC<BaseCardProps> = ({
  image,
  imageAlt,
  category,
  categoryIcon,
  categoryColorClass,
  isBoosted,
  boostedLabel = 'Sponsored',
  photoCount,
  title,
  location,
  price,
  currency,
  actionLabel,
  onActionClick,
  onClick,
  children,
  actionColorClass = 'bg-apple-blue text-white shadow-md shadow-apple-blue/20'
}) => {
  return (
    <article
      onClick={onClick}
      className="group apple-card overflow-hidden cursor-pointer flex flex-col h-full animate-apple-up"
      aria-label={title}
    >
      {/* ── Media Section ── */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 shrink-0">
        {image ? (
          <img
            src={image}
            alt={imageAlt || title}
            loading="lazy"
            decoding="async"
            onError={handleImgError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
            {categoryIcon}
          </div>
        )}

        {/* Category badge top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className={`badge ${categoryColorClass} text-white shadow-sm backdrop-blur-md bg-opacity-80`}>
            {categoryIcon} {category}
          </span>
        </div>

        {/* Save button top-right */}
        <button 
          onClick={(e) => { e.stopPropagation(); /* TODO: handle save */ }}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-all duration-300 active:scale-90 z-10"
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Boosted badge bottom-left */}
        {isBoosted && (
          <span className="absolute bottom-3 left-3 badge bg-amber-400 text-amber-950 font-black shadow-sm text-[9px] uppercase tracking-tighter">
            <Zap className="w-2.5 h-2.5 fill-current" /> {boostedLabel}
          </span>
        )}

        {/* Photo count bottom-right */}
        {photoCount && photoCount > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md">
            <Camera className="w-3 h-3" /> {photoCount}
          </div>
        )}
      </div>

      {/* ── Content Section ── */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title - fixed height for 2 lines to ensure alignment */}
        <div className="h-11 mb-1">
          <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 line-clamp-2 group-hover:text-opacity-80 transition-colors leading-snug">
            {title}
          </h3>
        </div>

        {/* Location - fixed height */}
        <div className="flex items-center gap-1 text-slate-400 text-[11px] h-4 mb-3 font-medium uppercase tracking-wide">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{location}</span>
        </div>

        {/* Dynamic content area - minimum height to keep footer aligned across cards */}
        <div className="min-h-[72px] flex flex-col justify-center">
          {children}
        </div>

        {/* Footer section */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="min-w-0">
            {price !== undefined && (
              <p className="font-heading font-bold text-lg text-slate-900 leading-none truncate">
                {typeof price === 'number' ? price.toLocaleString() : price}{' '}
                {currency && <span className="text-sm font-medium text-slate-500">{currency}</span>}
              </p>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onActionClick(e);
            }}
            className={`apple-button text-[12px] font-extrabold px-5 py-2.5 transition-all font-heading shrink-0 ${actionColorClass}`}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </article>
  );
};

export default BaseCard;
