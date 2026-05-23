import { ArrowRight, Briefcase, Car, Home, Wrench } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { adsAPI } from '../services/api';
import LaserFlow from './LaserFlow.jsx';

const PHRASES = [
  { text: 'a Car',        color: 'text-red-400' },
  { text: 'a Home',       color: 'text-emerald-400' },
  { text: 'a Job',        color: 'text-apple-blue' },
  { text: 'a Pro',        color: 'text-violet-400' },
  { text: 'anything',     color: 'text-amber-400' },
];

const STATS = [
  { key: 'listings', label: 'Listings' },
  { key: 'wilayas',  label: 'Wilayas'  },
  { key: 'free',     label: 'Free to Post' },
];

const CATEGORIES = [
  {
    to: '/auto',
    icon: Car,
    title: 'Vehicles',
    sub: 'Cars, trucks & motos',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    iconHoverBg: 'group-hover:bg-red-600',
    iconHoverColor: 'group-hover:text-white',
    border: 'hover:border-red-200',
    bg: 'hover:bg-red-50/30',
    arrow: 'group-hover:text-red-400',
  },
  {
    to: '/real-estate',
    icon: Home,
    title: 'Real Estate',
    sub: 'Apartments & villas',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    iconHoverBg: 'group-hover:bg-emerald-600',
    iconHoverColor: 'group-hover:text-white',
    border: 'hover:border-emerald-200',
    bg: 'hover:bg-emerald-50/30',
    arrow: 'group-hover:text-emerald-400',
  },
  {
    to: '/jobs',
    icon: Briefcase,
    title: 'Jobs',
    sub: 'Careers & freelance',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    iconHoverBg: 'group-hover:bg-blue-600',
    iconHoverColor: 'group-hover:text-white',
    border: 'hover:border-blue-200',
    bg: 'hover:bg-blue-50/30',
    arrow: 'group-hover:text-blue-400',
  },
  {
    to: '/services',
    icon: Wrench,
    title: 'Services',
    sub: 'Local pros & experts',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    iconHoverBg: 'group-hover:bg-violet-600',
    iconHoverColor: 'group-hover:text-white',
    border: 'hover:border-violet-200',
    bg: 'hover:bg-violet-50/30',
    arrow: 'group-hover:text-violet-400',
  },
];

const Hero: React.FC = () => {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [totalAds, setTotalAds] = useState(12000);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const fetchTotalAds = async () => {
      try {
        const response = await adsAPI.getAll({ limit: 1 });
        setTotalAds(response.total);
      } catch (error) {
        console.error('Failed to fetch total ads count:', error);
      }
    };
    fetchTotalAds();
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setPhraseIdx(i => (i + 1) % PHRASES.length);
        setVisible(true);
      }, 300);
    }, 2800);
    return () => clearInterval(timerRef.current);
  }, []);

  const formatCount = (count: number) => {
    if (count > 1000) {
      return `${Math.floor(count / 1000)}k+`;
    }
    return count.toString();
  };

  const statValues = {
    listings: formatCount(totalAds),
    wilayas: '58',
    free: '100%',
  };

  const phrase = PHRASES[phraseIdx];

  return (
    <section className="relative h-[100dvh] bg-black text-white flex flex-col justify-center items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <LaserFlow
          color="#7C3AED"
          wispDensity={0.5}
          flowSpeed={0.35}
          verticalSizing={1.7}
          horizontalSizing={3}
          fogIntensity={0.25}
          fogScale={0.35}
          wispSpeed={9}
          wispIntensity={3}
          flowStrength={1}
          decay={1.1}
          horizontalBeamOffset={0}
          verticalBeamOffset={-0.5}
          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        />
      </div>
      <div className="relative z-10 text-center px-4 pb-20 md:pb-0">
        {/* Eyebrow */}
        <p className="hidden sm:inline-flex items-center text-xs font-semibold uppercase tracking-widest text-white/50 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full mb-4 font-heading leading-none whitespace-nowrap">
          Algeria's #1 Marketplace
        </p>

        {/* Headline */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6 leading-[1.1]">
          Find{' '}
          {/* Ghost-sibling grid: locks width to the longest phrase ("anything")
              so the h1 never reflows when the animated word changes. */}
          <span className="inline-grid">
            {/* Invisible ghost — always holds the maximum width */}
            <span
              className="col-start-1 row-start-1 invisible select-none"
              aria-hidden="true"
            >
              anything
            </span>
            {/* Visible animated phrase — stacked in the same grid cell */}
            <span
              className={`col-start-1 row-start-1 text-center transition-all duration-500 ${phrase.color} ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {phrase.text}
            </span>
          </span>{' '}
          in Algeria
        </h1>

        <p className="text-blue-100/80 text-base sm:text-lg mb-8 max-w-xl mx-auto">
          The trusted marketplace for cars, homes, jobs, and skilled professionals.
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 mb-10">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <p className="font-heading text-xl sm:text-2xl font-extrabold text-white">
                {statValues[s.key as keyof typeof statValues]}
              </p>
              <p className="text-xs text-white/50 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Category cards */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3 font-heading">Browse by category</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.to}
                to={cat.to}
                className="group relative overflow-hidden flex items-center gap-3 px-4 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:bg-white/15 transition-all duration-300 active:scale-95 text-left"
              >
                <div className={`p-2.5 rounded-2xl ${cat.iconBg} ${cat.iconColor} group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                  <cat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white truncate font-heading tracking-tight">{cat.title}</p>
                  <p className="text-[10px] text-white/40 truncate font-medium uppercase tracking-wider">{cat.sub.split(' ')[0]}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;