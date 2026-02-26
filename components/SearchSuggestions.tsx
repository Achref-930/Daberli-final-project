import { MapPin, Search, Tag } from 'lucide-react';
import React from 'react';
import { Suggestion, SuggestionKind } from '../hooks/useSearchSuggestions';

interface SearchSuggestionsProps {
  suggestions: Suggestion[];
  query: string;
  selectedIndex: number;
  onSelect: (label: string) => void;
  /** Prevent blur-before-click by calling e.preventDefault() on mousedown */
  onMouseDown?: (e: React.MouseEvent) => void;
  className?: string;
}

// ── Icons per kind ─────────────────────────────────────────────────────────
const KIND_ICON: Record<SuggestionKind, React.ReactNode> = {
  title:    <Search  className="w-3.5 h-3.5 shrink-0" />,
  location: <MapPin  className="w-3.5 h-3.5 shrink-0" />,
  detail:   <Tag     className="w-3.5 h-3.5 shrink-0" />,
};

const KIND_BADGE: Record<SuggestionKind, string> = {
  title:    'Listing',
  location: 'Location',
  detail:   'Detail',
};

const KIND_COLOR: Record<SuggestionKind, string> = {
  title:    'text-blue-500',
  location: 'text-emerald-500',
  detail:   'text-violet-500',
};

const BADGE_COLOR: Record<SuggestionKind, string> = {
  title:    'bg-blue-50 text-blue-600',
  location: 'bg-emerald-50 text-emerald-600',
  detail:   'bg-violet-50 text-violet-600',
};

// ── Highlight matching portion of text ─────────────────────────────────────
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <>
      <span>{text.slice(0, idx)}</span>
      <span className="font-bold text-slate-900">{text.slice(idx, idx + query.length)}</span>
      <span>{text.slice(idx + query.length)}</span>
    </>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  query,
  selectedIndex,
  onSelect,
  onMouseDown,
  className = '',
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div
      role="listbox"
      aria-label="Search suggestions"
      onMouseDown={onMouseDown}
      className={`bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden ${className}`}
    >
      <ul>
        {suggestions.map((s, i) => {
          const isActive = i === selectedIndex;
          return (
            <li
              key={`${s.kind}-${s.label}`}
              role="option"
              aria-selected={isActive}
              onClick={() => onSelect(s.label)}
              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              {/* Icon */}
              <span className={KIND_COLOR[s.kind]}>{KIND_ICON[s.kind]}</span>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 truncate leading-snug">
                  <Highlight text={s.label} query={query} />
                </p>
                {s.sublabel && (
                  <p className="text-xs text-slate-400 truncate leading-snug">{s.sublabel}</p>
                )}
              </div>

              {/* Kind badge */}
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${BADGE_COLOR[s.kind]}`}>
                {KIND_BADGE[s.kind]}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Keyboard hint */}
      <div className="flex items-center gap-2 px-4 py-2 border-t border-gray-100 bg-gray-50/70">
        <kbd className="text-[10px] font-mono text-gray-400 bg-white border border-gray-200 rounded px-1">↑↓</kbd>
        <span className="text-[10px] text-gray-400">navigate</span>
        <kbd className="text-[10px] font-mono text-gray-400 bg-white border border-gray-200 rounded px-1">↵</kbd>
        <span className="text-[10px] text-gray-400">select</span>
        <kbd className="text-[10px] font-mono text-gray-400 bg-white border border-gray-200 rounded px-1">Esc</kbd>
        <span className="text-[10px] text-gray-400">dismiss</span>
      </div>
    </div>
  );
};

export default SearchSuggestions;
