import { useMemo } from 'react';
import { Ad, Category } from '../types';

export type SuggestionKind = 'title' | 'location' | 'detail';

export interface Suggestion {
  label: string;
  sublabel?: string;
  kind: SuggestionKind;
}

// Per-category detail fields that are worth surfacing as suggestions
const DETAIL_KEYS: Record<Category | 'all', string[]> = {
  auto:         ['brand', 'model'],
  'real-estate': ['type'],
  jobs:          ['company', 'sector'],
  services:      ['specialty'],
  all:           ['brand', 'model', 'company', 'sector', 'specialty', 'type'],
};

function strVal(v: unknown): string {
  return typeof v === 'string' ? v : typeof v === 'number' ? String(v) : '';
}

/**
 * Returns up to `maxResults` deduplicated, ranked suggestions for `query`.
 * Sorted: exact-prefix matches first, then substring matches.
 * Skips computation when query < 2 characters.
 */
export function useSearchSuggestions(
  query: string,
  ads: Ad[],
  category: Category | 'all' = 'all',
  maxResults = 8,
): Suggestion[] {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const seen = new Set<string>();
    const results: Array<Suggestion & { score: number }> = [];

    const push = (label: string, kind: SuggestionKind, sublabel?: string) => {
      const key = `${kind}:${label.toLowerCase()}`;
      if (seen.has(key)) return;
      seen.add(key);
      const lower = label.toLowerCase();
      const score = lower.startsWith(q) ? 0 : 1; // prefix before substring
      results.push({ label, sublabel, kind, score });
    };

    const detailKeys = DETAIL_KEYS[category] ?? DETAIL_KEYS.all;
    const targetAds = category === 'all' ? ads : ads.filter(a => a.category === category);

    for (const ad of targetAds) {
      // Title
      if (ad.title.toLowerCase().includes(q)) {
        push(ad.title, 'title');
      }

      // Location
      if (ad.location.toLowerCase().includes(q)) {
        push(ad.location, 'location');
      }

      // Category-specific detail fields
      if (ad.details) {
        for (const key of detailKeys) {
          const raw = strVal(ad.details[key]);
          if (raw && raw.toLowerCase().includes(q)) {
            // sublabel gives context, e.g. "brand → Renault"
            const kindLabel =
              key === 'brand' || key === 'model' ? ad.title
              : key === 'company' ? (strVal(ad.details['jobType']) || 'Job')
              : key === 'sector' ? strVal(ad.details['company']) || ''
              : key === 'specialty' ? ad.location
              : key === 'type' ? ad.location
              : undefined;
            push(raw, 'detail', kindLabel || undefined);
          }
        }
      }

      if (results.length >= maxResults * 3) break; // early-exit, we'll slice after sort
    }

    results.sort((a, b) => a.score - b.score || a.label.localeCompare(b.label));
    return results.slice(0, maxResults);
  }, [query, ads, category, maxResults]);
}
