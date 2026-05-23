import {
  AlignLeft,
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  Briefcase,
  Building2,
  Calendar,
  Car,
  CheckCircle,
  ChevronDown,
  Clock,
  DollarSign,
  Fuel,
  Gauge,
  Home,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Maximize2,
  Palette,
  Phone,
  Square,
  Star,
  Tag,
  Type,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { WILAYAS } from '../constants';
import { Category } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface PostAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PostAdFormData, images?: File[]) => Promise<void>;
}

export interface PostAdFormData {
  title: string;
  description: string;
  category: 'auto' | 'real-estate' | 'jobs' | 'services';
  price: number;
  currency: string;
  location: string;
  details?: Record<string, any>;
}

type Step = 1 | 2 | 3 | 4;

// ─── Detail shapes ────────────────────────────────────────────────────────────

interface AutoDetails {
  brand: string; model: string; year: string; mileage: string;
  fuelType: string; transmission: string; color: string; condition: string;
}
interface RealEstateDetails {
  type: string; area: string; bedrooms: string; bathrooms: string;
  floor: string; furnished: string;
}
interface JobDetails {
  company: string; jobType: string; experience: string;
  remote: string; sector: string;
}
interface ServiceDetails {
  specialty: string; rateType: string; yearsExp: string; availability: string;
}

// ─── Category theme config ────────────────────────────────────────────────────

const CATEGORY_CONFIG = {
  auto: {
    label: 'Vehicles',
    subtitle: 'Cars, motorbikes, trucks & more',
    icon: <Car className="w-7 h-7" />,
    iconSm: <Car className="w-3.5 h-3.5" />,
    border: 'border-red-500',
    bg: 'bg-red-50',
    text: 'text-red-600',
    ring: 'ring-red-400',
    focusRing: 'focus:ring-red-400/20',
    focusText: 'group-focus-within:text-red-600',
    focusIcon: 'group-focus-within:text-red-600',
    borderSoft: 'border-red-200',
    hoverBorderSoft: 'hover:border-red-200',
    hoverText: 'hover:text-red-600',
    hoverBg: 'hover:bg-red-50',
    btn: 'bg-red-600 hover:bg-red-700',
    btnShadow: 'shadow-red-200',
    badge: 'bg-red-100 text-red-700',
    badgeBorder: 'border-red-200',
    bar: 'bg-red-500',
    barShadow: 'shadow-red-200',
  },
  'real-estate': {
    label: 'Real Estate',
    subtitle: 'Apartments, villas, land & offices',
    icon: <Home className="w-7 h-7" />,
    iconSm: <Home className="w-3.5 h-3.5" />,
    border: 'border-emerald-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    ring: 'ring-emerald-400',
    focusRing: 'focus:ring-emerald-400/20',
    focusText: 'group-focus-within:text-emerald-600',
    focusIcon: 'group-focus-within:text-emerald-600',
    borderSoft: 'border-emerald-200',
    hoverBorderSoft: 'hover:border-emerald-200',
    hoverText: 'hover:text-emerald-600',
    hoverBg: 'hover:bg-emerald-50',
    btn: 'bg-emerald-600 hover:bg-emerald-700',
    btnShadow: 'shadow-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
    badgeBorder: 'border-emerald-200',
    bar: 'bg-emerald-500',
    barShadow: 'shadow-emerald-200',
  },
  jobs: {
    label: 'Jobs',
    subtitle: 'Full-time, freelance, internships',
    icon: <Briefcase className="w-7 h-7" />,
    iconSm: <Briefcase className="w-3.5 h-3.5" />,
    border: 'border-blue-500',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    ring: 'ring-blue-400',
    focusRing: 'focus:ring-blue-400/20',
    focusText: 'group-focus-within:text-blue-600',
    focusIcon: 'group-focus-within:text-blue-600',
    borderSoft: 'border-blue-200',
    hoverBorderSoft: 'hover:border-blue-200',
    hoverText: 'hover:text-blue-600',
    hoverBg: 'hover:bg-blue-50',
    btn: 'bg-blue-600 hover:bg-blue-700',
    btnShadow: 'shadow-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    badgeBorder: 'border-blue-200',
    bar: 'bg-blue-500',
    barShadow: 'shadow-blue-200',
  },
  services: {
    label: 'Services',
    subtitle: 'Repairs, tutoring, design & more',
    icon: <Wrench className="w-7 h-7" />,
    iconSm: <Wrench className="w-3.5 h-3.5" />,
    border: 'border-violet-500',
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    ring: 'ring-violet-400',
    focusRing: 'focus:ring-violet-400/20',
    focusText: 'group-focus-within:text-violet-600',
    focusIcon: 'group-focus-within:text-violet-600',
    borderSoft: 'border-violet-200',
    hoverBorderSoft: 'hover:border-violet-200',
    hoverText: 'hover:text-violet-600',
    hoverBg: 'hover:bg-violet-50',
    btn: 'bg-violet-600 hover:bg-violet-700',
    btnShadow: 'shadow-violet-200',
    badge: 'bg-violet-100 text-violet-700',
    badgeBorder: 'border-violet-200',
    bar: 'bg-violet-500',
    barShadow: 'shadow-violet-200',
  },
} as const;

const CATEGORY_ENTRIES = Object.entries(CATEGORY_CONFIG) as [
  Category,
  typeof CATEGORY_CONFIG[Category]
][];

// ─── Small reusable pieces ────────────────────────────────────────────────────

type AccentConfig = typeof CATEGORY_CONFIG[Category];

const FieldWrapper: React.FC<{
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  hint?: string;
  accent?: AccentConfig;
}> = ({ label, icon, children, hint, accent }) => (
  <div className="group">
    <label className={`block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4 transition-colors ${accent?.focusText ?? 'group-focus-within:text-apple-blue'}`}>{label}</label>
    <div className="relative">
      {icon && (
        <span className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 transition-colors ${accent?.focusIcon ?? 'group-focus-within:text-apple-blue'}`}>
          {icon}
        </span>
      )}
      {children}
    </div>
    {hint && <p className="mt-2 text-[10px] font-bold text-slate-400 ml-4 uppercase tracking-wider">{hint}</p>}
  </div>
);

const inputCls = (accent: AccentConfig, hasIcon = true) =>
  `block w-full ${hasIcon ? 'pl-12' : 'px-5'} pr-5 py-4 bg-slate-50 border-none rounded-2xl
   text-slate-900 placeholder-slate-300 text-sm font-bold
   focus:outline-none focus:ring-8 ${accent.focusRing} focus:bg-white transition-colors duration-150`;

const selectCls = (accent: AccentConfig, hasIcon = true) =>
  `${inputCls(accent, hasIcon)} appearance-none cursor-pointer`;

const DownIcon = () => (
  <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
    <ChevronDown className="w-4 h-4" />
  </span>
);

// ─── Step 1 — Category Picker ─────────────────────────────────────────────────

type StepCategoryProps = {
  selected: Category;
  onSelect: (c: Category) => void;
};

const StepCategory = React.memo(({ selected, onSelect }: StepCategoryProps) => (
  <div className="space-y-3">
    <p className="text-sm text-gray-500 mb-1">What are you listing?</p>
    <div className="grid grid-cols-2 gap-4">
      {CATEGORY_ENTRIES.map(([cat, cfg]) => {
        const active = selected === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat)}
            className={`apple-card flex flex-col items-center text-center gap-4 p-6 transition-colors transition-shadow transition-transform duration-150 active:scale-95
              ${active
                ? `ring-2 ${cfg.ring} ring-opacity-20 ${cfg.bg} shadow-lg -translate-y-1`
                : `${cfg.bg} hover:shadow-md`}
            `}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-150 ${
                active ? `${cfg.btn} text-white shadow-lg` : `bg-white/80 ${cfg.text}`
              }`}
            >
              {cfg.icon}
            </div>
            <div>
              <p className={`font-black text-xs uppercase tracking-widest ${cfg.text}`}>{cfg.label}</p>
              <p className={`text-[10px] mt-1.5 font-bold leading-tight ${cfg.text} opacity-70`}>{cfg.subtitle}</p>
            </div>
          </button>
        );
      })}
    </div>
  </div>
));

StepCategory.displayName = 'StepCategory';

// ─── Step 2 — Basic Info ──────────────────────────────────────────────────────

interface BaseForm {
  title: string; category: Category;
  price: string; priceUnit: string;
  location: string; images: string[]; description: string;
}

const StepBasic: React.FC<{
  data: BaseForm;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}> = ({ data, onChange }) => {
  const cfg = CATEGORY_CONFIG[data.category];
  const placeholder = {
    auto: 'e.g., Renault Clio 4 GT Line 2019',
    'real-estate': 'e.g., Bright 3-room apartment in Hydra',
    jobs: 'e.g., Senior Full-Stack Developer',
    services: 'e.g., Professional Plumbing & Pipe Repair',
  }[data.category];

  return (
    <div className="space-y-4">
      {/* Category badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${cfg.badge} ${cfg.badgeBorder}`}>
        {cfg.iconSm}{cfg.label}
      </div>

      {/* Title */}
      <FieldWrapper accent={cfg} label="Ad Title *" icon={<Type className="w-4 h-4" />}>
        <input
          autoFocus
          type="text"
          name="title"
          required
          value={data.title}
          onChange={onChange}
          placeholder={placeholder}
          className={inputCls(cfg)}
        />
      </FieldWrapper>

      {/* Wilaya */}
      <FieldWrapper accent={cfg} label="Wilaya *" icon={<MapPin className="w-4 h-4" />}>
        <select name="location" required value={data.location} onChange={onChange} className={selectCls(cfg)}>
          <option value="">Choose wilaya</option>
          {WILAYAS.map((w) => (
            <option key={w.code} value={w.name}>{w.code} — {w.name}</option>
          ))}
        </select>
        <DownIcon />
      </FieldWrapper>

      {/* Price + unit */}
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper accent={cfg} label="Price (DZD)" icon={<DollarSign className="w-4 h-4" />}>
          <input
            type="number"
            name="price"
            min="0"
            value={data.price}
            onChange={onChange}
            placeholder="0"
            className={inputCls(cfg)}
          />
        </FieldWrapper>
        <FieldWrapper accent={cfg} label="Pricing type">
          <select name="priceUnit" value={data.priceUnit} onChange={onChange} className={selectCls(cfg, false)}>
            <option value="DZD">DZD — Fixed</option>
            <option value="Negotiable">Negotiable</option>
            <option value="DZD/month">DZD / month</option>
            <option value="DZD/day">DZD / day</option>
            <option value="DZD/hour">DZD / hour</option>
          </select>
          <DownIcon />
        </FieldWrapper>
      </div>
    </div>
  );
};

// ─── Step 3 — Category-specific details ──────────────────────────────────────

const StepAutoDetails: React.FC<{
  d: AutoDetails;
  set: (k: keyof AutoDetails, v: string) => void;
}> = ({ d, set }) => {
  const cfg = CATEGORY_CONFIG.auto;
  const ch = (k: keyof AutoDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => set(k, e.target.value);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper accent={cfg} label="Brand" icon={<Car className="w-4 h-4" />}>
          <select value={d.brand} onChange={ch('brand')} className={selectCls(cfg)}>
            <option value="">Select brand</option>
            {['Renault','Peugeot','Citroën','Volkswagen','Toyota','Hyundai','Kia','Dacia','BMW','Mercedes-Benz','Audi','Ford','Fiat','Opel','Seat','Skoda','Suzuki','Nissan','Honda','Mitsubishi','Mazda','Other'].map(b => <option key={b}>{b}</option>)}
          </select>
          <DownIcon />
        </FieldWrapper>
        <FieldWrapper accent={cfg} label="Model" icon={<Tag className="w-4 h-4" />}>
          <input value={d.model} onChange={ch('model')} placeholder="e.g., Clio 4" className={inputCls(cfg)} />
        </FieldWrapper>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper accent={cfg} label="Year" icon={<Calendar className="w-4 h-4" />}>
          <select value={d.year} onChange={ch('year')} className={selectCls(cfg)}>
            <option value="">Year</option>
            {Array.from({ length: 37 }, (_, i) => 2026 - i).map(y => <option key={y}>{y}</option>)}
          </select>
          <DownIcon />
        </FieldWrapper>
        <FieldWrapper accent={cfg} label="Mileage (km)" icon={<Gauge className="w-4 h-4" />}>
          <input type="number" min="0" value={d.mileage} onChange={ch('mileage')} placeholder="e.g., 45 000" className={inputCls(cfg)} />
        </FieldWrapper>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper accent={cfg} label="Fuel type" icon={<Fuel className="w-4 h-4" />}>
          <select value={d.fuelType} onChange={ch('fuelType')} className={selectCls(cfg)}>
            <option value="">Select</option>
            {['Essence','Gasoil','GPL','Électrique','Hybride'].map(f => <option key={f}>{f}</option>)}
          </select>
          <DownIcon />
        </FieldWrapper>
        <FieldWrapper accent={cfg} label="Transmission" icon={<Zap className="w-4 h-4" />}>
          <select value={d.transmission} onChange={ch('transmission')} className={selectCls(cfg)}>
            <option value="">Select</option>
            <option>Manual</option>
            <option>Automatic</option>
          </select>
          <DownIcon />
        </FieldWrapper>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper accent={cfg} label="Color" icon={<Palette className="w-4 h-4" />}>
          <input value={d.color} onChange={ch('color')} placeholder="e.g., White" className={inputCls(cfg)} />
        </FieldWrapper>
        <FieldWrapper accent={cfg} label="Condition" icon={<CheckCircle className="w-4 h-4" />}>
          <select value={d.condition} onChange={ch('condition')} className={selectCls(cfg)}>
            <option value="">Select</option>
            {['Neuf','Excellent état','Bon état','État correct','À réviser'].map(c => <option key={c}>{c}</option>)}
          </select>
          <DownIcon />
        </FieldWrapper>
      </div>
    </div>
  );
};

const StepRealEstateDetails: React.FC<{
  d: RealEstateDetails;
  set: (k: keyof RealEstateDetails, v: string) => void;
}> = ({ d, set }) => {
  const cfg = CATEGORY_CONFIG['real-estate'];
  const ch = (k: keyof RealEstateDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => set(k, e.target.value);
  return (
    <div className="space-y-4">
      <FieldWrapper accent={cfg} label="Property type" icon={<Home className="w-4 h-4" />}>
        <select value={d.type} onChange={ch('type')} className={selectCls(cfg)}>
          <option value="">Select type</option>
          {['Appartement','Villa','Studio','Bureau','Local commercial','Terrain','Maison','Duplex','Penthouse'].map(t => <option key={t}>{t}</option>)}
        </select>
        <DownIcon />
      </FieldWrapper>

      <div className="grid grid-cols-3 gap-3">
        <FieldWrapper accent={cfg} label="Area (m²)" icon={<Square className="w-4 h-4" />}>
          <input type="number" min="1" value={d.area} onChange={ch('area')} placeholder="m²" className={inputCls(cfg)} />
        </FieldWrapper>
        <FieldWrapper accent={cfg} label="Bedrooms" icon={<BedDouble className="w-4 h-4" />}>
          <select value={d.bedrooms} onChange={ch('bedrooms')} className={selectCls(cfg)}>
            <option value="">—</option>
            {['Studio','1','2','3','4','5','6+'].map(n => <option key={n}>{n}</option>)}
          </select>
          <DownIcon />
        </FieldWrapper>
        <FieldWrapper accent={cfg} label="Bathrooms" icon={<Bath className="w-4 h-4" />}>
          <select value={d.bathrooms} onChange={ch('bathrooms')} className={selectCls(cfg)}>
            <option value="">—</option>
            {['1','2','3','4+'].map(n => <option key={n}>{n}</option>)}
          </select>
          <DownIcon />
        </FieldWrapper>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper accent={cfg} label="Floor" icon={<Building2 className="w-4 h-4" />}>
          <select value={d.floor} onChange={ch('floor')} className={selectCls(cfg)}>
            <option value="">Select</option>
            {['Rez-de-chaussée','1er étage','2ème étage','3ème étage','4ème étage','5ème étage','6ème+ étage','Dernier étage'].map(f => <option key={f}>{f}</option>)}
          </select>
          <DownIcon />
        </FieldWrapper>
        <FieldWrapper accent={cfg} label="Furnished" icon={<CheckCircle className="w-4 h-4" />}>
          <select value={d.furnished} onChange={ch('furnished')} className={selectCls(cfg)}>
            <option value="">Select</option>
            <option value="yes">✓ Furnished</option>
            <option value="no">✗ Unfurnished</option>
            <option value="partial">⟳ Partially</option>
          </select>
          <DownIcon />
        </FieldWrapper>
      </div>
    </div>
  );
};

const StepJobDetails: React.FC<{
  d: JobDetails;
  set: (k: keyof JobDetails, v: string) => void;
}> = ({ d, set }) => {
  const cfg = CATEGORY_CONFIG['jobs'];
  const ch = (k: keyof JobDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => set(k, e.target.value);
  return (
    <div className="space-y-4">
      <FieldWrapper accent={cfg} label="Company name" icon={<Building2 className="w-4 h-4" />}>
        <input value={d.company} onChange={ch('company')} placeholder="e.g., Sonatrach, Ooredoo, Freelance" className={inputCls(cfg)} />
      </FieldWrapper>
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper accent={cfg} label="Contract type" icon={<Briefcase className="w-4 h-4" />}>
          <select value={d.jobType} onChange={ch('jobType')} className={selectCls(cfg)}>
            <option value="">Select</option>
            {['CDI','CDD','Freelance','Stage','Intérim','Temps partiel'].map(t => <option key={t}>{t}</option>)}
          </select>
          <DownIcon />
        </FieldWrapper>
        <FieldWrapper accent={cfg} label="Work mode" icon={<MapPin className="w-4 h-4" />}>
          <select value={d.remote} onChange={ch('remote')} className={selectCls(cfg)}>
            <option value="">Select</option>
            {['Présentiel','Remote','Hybride'].map(m => <option key={m}>{m}</option>)}
          </select>
          <DownIcon />
        </FieldWrapper>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper accent={cfg} label="Experience required" icon={<Clock className="w-4 h-4" />}>
          <select value={d.experience} onChange={ch('experience')} className={selectCls(cfg)}>
            <option value="">Select</option>
            {['Débutant (0–1 an)','1–3 ans','3–5 ans','5–10 ans','10+ ans'].map(e => <option key={e}>{e}</option>)}
          </select>
          <DownIcon />
        </FieldWrapper>
        <FieldWrapper accent={cfg} label="Sector / Industry" icon={<Tag className="w-4 h-4" />}>
          <input value={d.sector} onChange={ch('sector')} placeholder="e.g., IT, BTP, Finance" className={inputCls(cfg)} />
        </FieldWrapper>
      </div>
    </div>
  );
};

const StepServiceDetails: React.FC<{
  d: ServiceDetails;
  set: (k: keyof ServiceDetails, v: string) => void;
}> = ({ d, set }) => {
  const cfg = CATEGORY_CONFIG['services'];
  const ch = (k: keyof ServiceDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => set(k, e.target.value);
  return (
    <div className="space-y-4">
      <FieldWrapper accent={cfg} label="Specialty / Trade *" icon={<Wrench className="w-4 h-4" />}>
        <input value={d.specialty} onChange={ch('specialty')} placeholder="e.g., Plomberie, Web Design, Cours de Maths" className={inputCls(cfg)} />
      </FieldWrapper>
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper accent={cfg} label="Rate type" icon={<DollarSign className="w-4 h-4" />}>
          <select value={d.rateType} onChange={ch('rateType')} className={selectCls(cfg)}>
            <option value="">Select</option>
            <option>Prix fixe</option>
            <option>Par heure</option>
            <option>Par jour</option>
            <option>Par projet</option>
            <option>Négociable</option>
          </select>
          <DownIcon />
        </FieldWrapper>
        <FieldWrapper accent={cfg} label="Years of experience" icon={<Calendar className="w-4 h-4" />}>
          <select value={d.yearsExp} onChange={ch('yearsExp')} className={selectCls(cfg)}>
            <option value="">Select</option>
            {['Moins d\'1 an','1–3 ans','3–5 ans','5–10 ans','10+ ans'].map(y => <option key={y}>{y}</option>)}
          </select>
          <DownIcon />
        </FieldWrapper>
      </div>
      <FieldWrapper accent={cfg} label="Availability" icon={<Clock className="w-4 h-4" />}>
        <select value={d.availability} onChange={ch('availability')} className={selectCls(cfg)}>
          <option value="">Select</option>
          {['Immédiat','Week-ends uniquement','Semaine uniquement','Soirs uniquement','Flexible'].map(a => <option key={a}>{a}</option>)}
        </select>
        <DownIcon />
      </FieldWrapper>
      <FieldWrapper accent={cfg} label="Contact phone (optional)" icon={<Phone className="w-4 h-4" />}>
        <input type="tel" placeholder="+213 5xx xx xx xx" className={inputCls(cfg)} />
      </FieldWrapper>
    </div>
  );
};

// ─── Step 4 — Photo & Description ────────────────────────────────────────────

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_MB = 10;
const MAX_IMAGES = 6;
const COMPRESS_MAX_WIDTH = 1400;
const COMPRESS_QUALITY = 0.85;

// ─── Image compression utility ───────────────────────────────────────────────

const compressImage = (file: File, maxWidth = COMPRESS_MAX_WIDTH, quality = COMPRESS_QUALITY): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas context unavailable')); return; }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });

const StepPhoto: React.FC<{
  base: BaseForm;
  onDescChange: (v: string) => void;
  onImagesChange: (updater: (prev: string[]) => string[]) => void;
  onFileAdd?: (file: File) => void;
  onFileRemove?: (index: number) => void;
}> = ({ base, onDescChange, onImagesChange, onFileAdd, onFileRemove }) => {
  const fileRef     = useRef<HTMLInputElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [loadingCount, setLoadingCount] = useState(0);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [slideDir, setSlideDir] = useState<'left' | 'right' | null>(null);
  const [showKbHints, setShowKbHints] = useState(() => !localStorage.getItem('daberli_kb_hints_seen'));
  const [pinchScale, setPinchScale] = useState(1);
  const [pinchOffset, setPinchOffset] = useState({ x: 0, y: 0 });
  const pinchStartRef = useRef<{ dist: number; scale: number; center: { x: number; y: number } } | null>(null);
  const cfg = CATEGORY_CONFIG[base.category];

  // Lightbox keyboard nav — capture phase so Escape only closes lightbox, not the modal
  useEffect(() => {
    if (lightbox === null) return;
    const h = (e: KeyboardEvent) => {
      if (showKbHints) {
        setShowKbHints(false);
        localStorage.setItem('daberli_kb_hints_seen', 'true');
      }
      if (e.key === 'Escape') { e.stopImmediatePropagation(); closeLightbox(); }
      if (e.key === 'ArrowLeft')  goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', h, true);
    return () => window.removeEventListener('keydown', h, true);
  }, [lightbox, base.images.length, showKbHints]);

  // Auto-hide keyboard hints after 3 seconds
  useEffect(() => {
    if (lightbox === null || !showKbHints) return;
    const t = setTimeout(() => {
      setShowKbHints(false);
      localStorage.setItem('daberli_kb_hints_seen', 'true');
    }, 3000);
    return () => clearTimeout(t);
  }, [lightbox, showKbHints]);

  // Reset pinch-zoom when lightbox closes or index changes
  useEffect(() => {
    setPinchScale(1);
    setPinchOffset({ x: 0, y: 0 });
  }, [lightbox]);

  // Lightbox navigation with slide animation
  const goToNext = () => {
    setSlideDir('left');
    setTimeout(() => {
      setLightbox(i => (i !== null ? (i + 1) % base.images.length : 0));
      setSlideDir(null);
    }, 150);
  };
  const goToPrev = () => {
    setSlideDir('right');
    setTimeout(() => {
      setLightbox(i => (i !== null && i > 0 ? i - 1 : base.images.length - 1));
      setSlideDir(null);
    }, 150);
  };
  const closeLightbox = () => {
    setLightbox(null);
    setPinchScale(1);
    setPinchOffset({ x: 0, y: 0 });
  };

  // Touch swipe for lightbox (single finger)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch start
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      pinchStartRef.current = {
        dist,
        scale: pinchScale,
        center: { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 },
      };
    } else {
      touchStartX.current = e.touches[0].clientX;
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartRef.current) {
      e.preventDefault();
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const newScale = Math.min(3, Math.max(1, pinchStartRef.current.scale * (dist / pinchStartRef.current.dist)));
      setPinchScale(newScale);
      if (newScale > 1) {
        const cx = (t1.clientX + t2.clientX) / 2;
        const cy = (t1.clientY + t2.clientY) / 2;
        setPinchOffset({
          x: cx - pinchStartRef.current.center.x,
          y: cy - pinchStartRef.current.center.y,
        });
      } else {
        setPinchOffset({ x: 0, y: 0 });
      }
    }
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (pinchStartRef.current) {
      pinchStartRef.current = null;
      if (pinchScale <= 1) {
        setPinchScale(1);
        setPinchOffset({ x: 0, y: 0 });
      }
      return;
    }
    if (touchStartX.current === null || pinchScale > 1) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) goToNext();
      else        goToPrev();
    }
    touchStartX.current = null;
  };

  const processFiles = async (files: FileList | File[]) => {
    setFileError(null);
    const arr = Array.from(files);
    const remaining = MAX_IMAGES - base.images.length - loadingCount;
    if (remaining <= 0) { setFileError(`Maximum ${MAX_IMAGES} photos already reached.`); return; }
    const toProcess = arr.slice(0, remaining);
    if (arr.length > remaining)
      setFileError(`Only the first ${remaining} photo(s) were added — maximum reached.`);

    for (const file of toProcess) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setFileError('Only JPG, PNG, and WEBP images are accepted.');
        continue;
      }
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        setFileError(`"${file.name}" exceeds the ${MAX_FILE_MB} MB limit.`);
        continue;
      }
      setLoadingCount(c => c + 1);
      try {
        const compressed = await compressImage(file);
        onImagesChange(prev => [...prev, compressed]);
        onFileAdd?.(file);
      } catch {
        setFileError(`Failed to process "${file.name}".`);
      } finally {
        setLoadingCount(c => c - 1);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = '';
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const handleRemove = (idx: number) => {
    onImagesChange(prev => prev.filter((_, i) => i !== idx));
    onFileRemove?.(idx);
    closeLightbox();
  };

  // Drag-to-reorder handlers
  const handleDragStart = (idx: number) => (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggingIdx(idx);
  };
  const handleDragOver = (idx: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggingIdx !== null && idx !== draggingIdx) setDragOverIdx(idx);
  };
  const handleDragLeave = () => setDragOverIdx(null);
  const handleReorderDrop = (targetIdx: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (draggingIdx === null || draggingIdx === targetIdx) {
      setDraggingIdx(null);
      setDragOverIdx(null);
      return;
    }
    onImagesChange(prev => {
      const next = [...prev];
      const [item] = next.splice(draggingIdx, 1);
      next.splice(targetIdx > draggingIdx ? targetIdx : targetIdx, 0, item);
      return next;
    });
    setDraggingIdx(null);
    setDragOverIdx(null);
  };
  const handleDragEnd = () => {
    setDraggingIdx(null);
    setDragOverIdx(null);
  };

  return (
    <div className="space-y-5">
      {/* Mini summary */}
      <div className="apple-card bg-slate-50 border-none p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-apple-blue/10 flex items-center justify-center text-apple-blue shadow-inner">
          {cfg.iconSm}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black text-slate-900 uppercase tracking-widest truncate">
            {base.title || 'Untitled Ad'}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">
            {base.location || 'No wilaya'} ·{' '}
            {base.price ? `${Number(base.price).toLocaleString()} ${base.priceUnit}` : 'No price'}
          </p>
        </div>
      </div>

      {/* Photos — Hero + Filmstrip layout */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">
            <ImageIcon className="w-4 h-4 text-apple-blue" />
            Photos <span className="text-red-400">*</span>
          </label>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mr-4">{base.images.length} / {MAX_IMAGES}</span>
        </div>

        {base.images.length > 0 ? (
          <div className="space-y-2">
            {/* ─ Hero (cover) ─ */}
            <div
              className="relative rounded-xl overflow-hidden aspect-video bg-gray-100 group cursor-zoom-in"
              onClick={() => setLightbox(0)}
            >
              <img
                src={base.images[0]}
                alt="Cover photo"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x340?text=Photo'; }}
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              {/* Cover badge */}
              <span className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full pointer-events-none">
                <Star className="w-3 h-3 fill-current" /> Cover
              </span>
              {/* Photo count */}
              {base.images.length > 1 && (
                <span className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/55 text-white text-[10px] font-bold px-2 py-0.5 rounded-full pointer-events-none">
                  <ImageIcon className="w-3 h-3" /> {base.images.length}
                </span>
              )}
              {/* Zoom hint */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="p-2.5 rounded-full bg-white/20 backdrop-blur-sm">
                  <Maximize2 className="w-5 h-5 text-white drop-shadow" />
                </div>
              </div>
              {/* Remove cover */}
              <button
                type="button"
                aria-label="Remove cover photo"
                onClick={(e) => { e.stopPropagation(); handleRemove(0); }}
                className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-black/60 hover:bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
              >
                <X className="w-3 h-3" /> Remove
              </button>
            </div>

            {/* ─ Filmstrip (drag-to-reorder) ─ */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {base.images.slice(1).map((img, i) => {
                const idx = i + 1;
                const isDragging = draggingIdx === idx;
                const isDropTarget = dragOverIdx === idx;
                return (
                  <div
                    key={idx}
                    draggable
                    onDragStart={handleDragStart(idx)}
                    onDragOver={handleDragOver(idx)}
                    onDragLeave={handleDragLeave}
                    onDrop={handleReorderDrop(idx)}
                    onDragEnd={handleDragEnd}
                    className={`relative shrink-0 w-24 aspect-square rounded-2xl overflow-hidden bg-slate-100 group cursor-grab active:cursor-grabbing transition-all duration-300
                      ${isDragging ? 'opacity-50 scale-95' : ''}
                      ${isDropTarget ? 'ring-4 ring-apple-blue/20 ring-offset-2' : ''}`}
                    onClick={() => setLightbox(idx)}
                  >
                    <img
                      src={img}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110 pointer-events-none"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x80?text=Photo'; }}
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    {/* Index badge */}
                    <span className="absolute top-1 left-1 bg-black/55 text-white text-[9px] font-bold px-1 py-0.5 rounded pointer-events-none">{idx + 1}</span>
                    {/* Remove */}
                    <button
                      type="button"
                      aria-label="Remove photo"
                      onClick={(e) => { e.stopPropagation(); handleRemove(idx); }}
                      className="absolute top-1 right-1 p-0.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all z-10"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                    {/* Drag hint */}
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[8px] font-semibold px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Drag to reorder
                    </span>
                  </div>
                );
              })}

              {/* Loading progress rings */}
              {loadingCount > 0 && Array.from({ length: loadingCount }).map((_, li) => (
                <div
                  key={`loading-${li}`}
                  className="shrink-0 w-24 aspect-square rounded-2xl border-4 border-dashed border-slate-100 flex items-center justify-center bg-slate-50"
                >
                  <div className="relative w-8 h-8">
                    <svg className="animate-spin" viewBox="0 0 36 36">
                      <circle className="text-slate-100" stroke="currentColor" strokeWidth="4" fill="none" cx="18" cy="18" r="14" />
                      <circle className="text-apple-blue" stroke="currentColor" strokeWidth="4" fill="none" cx="18" cy="18" r="14"
                        strokeDasharray="88" strokeDashoffset="66" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              ))}

              {/* + Add tile in filmstrip */}
              {base.images.length + loadingCount < MAX_IMAGES && (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); processFiles(e.dataTransfer.files); }}
                  onClick={() => fileRef.current?.click()}
                  className={`shrink-0 w-24 aspect-square rounded-2xl border-4 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer select-none transition-all
                    ${dragOver ? 'border-apple-blue bg-apple-blue/5 text-apple-blue' : 'border-slate-100 text-slate-300 hover:border-apple-blue/30 hover:text-apple-blue hover:bg-slate-50'}`}
                >
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Add</span>
                </div>
              )}
            </div>
          </div>
        ) : loadingCount > 0 ? (
          <div className="w-full border-4 border-dashed border-apple-blue/20 bg-apple-blue/5 rounded-4xl py-12 flex flex-col items-center gap-4 animate-pulse">
            <div className="relative w-14 h-14">
              <svg className="animate-spin" viewBox="0 0 36 36">
                <circle className="text-apple-blue/10" stroke="currentColor" strokeWidth="4" fill="none" cx="18" cy="18" r="14" />
                <circle className="text-apple-blue" stroke="currentColor" strokeWidth="4" fill="none" cx="18" cy="18" r="14"
                  strokeDasharray="88" strokeDashoffset="66" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm font-black text-apple-blue uppercase tracking-widest">Processing {loadingCount} photo{loadingCount > 1 ? 's' : ''}…</span>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); processFiles(e.dataTransfer.files); }}
            onClick={() => fileRef.current?.click()}
            className={`w-full border-4 border-dashed rounded-[2.5rem] py-16 flex flex-col items-center gap-4 cursor-pointer select-none transition-all duration-300
              ${dragOver ? 'border-apple-blue bg-apple-blue/5 text-apple-blue scale-102' : 'border-slate-100 text-slate-300 hover:border-apple-blue/30 hover:text-apple-blue hover:bg-slate-50'}`}
          >
            <div className="w-16 h-16 rounded-4xl bg-slate-50 flex items-center justify-center text-slate-200 mb-2 transition-colors group-hover:text-apple-blue">
              <ImageIcon className="w-8 h-8" />
            </div>
            <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Add photos</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">JPG · PNG · WEBP — max {MAX_FILE_MB}MB each</span>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />

        {fileError && (
          <div className="mt-2 flex items-center gap-1.5 text-red-600 text-xs font-medium">
            <X className="w-3.5 h-3.5 shrink-0" /> {fileError}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="group">
        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4 group-focus-within:text-apple-blue transition-colors">
          Description{' '}
          {base.category === 'jobs' || base.category === 'services'
            ? <span className="text-red-400">*</span>
            : <span className="text-slate-300 font-bold lowercase tracking-tight">(optional)</span>}
        </label>
        <div className="relative">
          <span className="absolute top-5 left-5 text-slate-300 pointer-events-none group-focus-within:text-apple-blue transition-colors">
            <AlignLeft className="w-5 h-5" />
          </span>
          <textarea
            rows={5}
            value={base.description}
            onChange={(e) => onDescChange(e.target.value)}
            maxLength={1000}
            placeholder={
              base.category === 'auto'
                ? 'Describe the vehicle condition, accessories, service history…'
                : base.category === 'real-estate'
                ? 'Describe the property, amenities, nearby transport, schools…'
                : base.category === 'jobs'
                ? 'Describe the role, responsibilities, required skills, and benefits…'
                : 'Describe your service, what is included, and why clients should choose you…'
            }
            className="block w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-4xl text-sm text-slate-900 font-bold
              placeholder-slate-300 resize-none focus:outline-none focus:ring-8 focus:ring-apple-blue/5 focus:bg-white transition-all"
          />
          <p className="mt-3 text-[10px] font-black text-slate-400 text-right uppercase tracking-widest mr-4">{base.description.length} / 1000</p>
        </div>
      </div>

      {/* Lightbox with thumbnail filmstrip + swipe + pinch-zoom + transitions */}
      {lightbox !== null && base.images[lightbox] && (
        <div
          className="fixed inset-0 z-200 bg-black/95 flex flex-col items-center justify-center"
          onClick={() => closeLightbox()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors z-10"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-xs font-medium">
            {lightbox + 1} / {base.images.length}
          </div>

          {/* Prev / Next arrows */}
          {base.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors z-10"
                aria-label="Previous photo"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors z-10"
                aria-label="Next photo"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Main image with slide transition and pinch-zoom */}
          <img
            src={base.images[lightbox]}
            alt={`Photo ${lightbox + 1}`}
            className={`max-w-[88vw] max-h-[72vh] rounded-xl object-contain shadow-2xl select-none transition-all duration-150 ease-out
              ${slideDir === 'left' ? 'opacity-0 -translate-x-8' : ''}
              ${slideDir === 'right' ? 'opacity-0 translate-x-8' : ''}`}
            style={{
              transform: `scale(${pinchScale}) translate(${pinchOffset.x / pinchScale}px, ${pinchOffset.y / pinchScale}px)`,
              touchAction: pinchScale > 1 ? 'none' : 'pan-y',
            }}
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />

          {/* Pinch zoom indicator */}
          {pinchScale > 1 && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {Math.round(pinchScale * 100)}%
            </div>
          )}

          {/* Thumbnail filmstrip */}
          {base.images.length > 1 && (
            <div
              className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {base.images.map((thumb, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSlideDir(i > lightbox ? 'left' : 'right'); setTimeout(() => { setLightbox(i); setSlideDir(null); }, 150); }}
                  className={`shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all
                    ${i === lightbox ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-80'}`}
                  aria-label={`Go to photo ${i + 1}`}
                >
                  <img src={thumb} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Keyboard hints footer */}
          {showKbHints && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white/15 backdrop-blur-sm text-white/80 text-xs font-medium px-4 py-1.5 rounded-full flex items-center gap-3 animate-pulse">
              <span className="flex items-center gap-1"><span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">←</span><span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">→</span> Navigate</span>
              <span className="w-px h-3 bg-white/30" />
              <span className="flex items-center gap-1"><span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">ESC</span> Close</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Initial State Constants ──────────────────────────────────────────────────

const INIT_BASE: BaseForm = {
  title: '', category: 'auto', price: '', priceUnit: 'DZD',
  location: '', images: [], description: '',
};
const INIT_AUTO: AutoDetails = { brand: '', model: '', year: '', mileage: '', fuelType: '', transmission: '', color: '', condition: '' };
const INIT_RE: RealEstateDetails = { type: '', area: '', bedrooms: '', bathrooms: '', floor: '', furnished: '' };
const INIT_JOB: JobDetails = { company: '', jobType: '', experience: '', remote: '', sector: '' };
const INIT_SVC: ServiceDetails = { specialty: '', rateType: '', yearsExp: '', availability: '' };

const DRAFT_KEY = 'daberli_post_draft_v2';

const STEP_LABELS: Record<Step, string> = { 1: 'Category', 2: 'Basic Info', 3: 'Details', 4: 'Photo & Submit' };

// ─── Step Validation (single source of truth) ─────────────────────────────────

type StepError = string | null;

const validateStep = (
  step: Step,
  base: BaseForm,
  svcD: ServiceDetails
): StepError => {
  switch (step) {
    case 1:
      return null; // category is always selected
    case 2:
      if (!base.title.trim()) return 'Please enter a title for your ad.';
      if (!base.location)     return 'Please select a wilaya.';
      return null;
    case 3:
      if (base.category === 'services' && !svcD.specialty.trim())
        return 'Please enter your specialty.';
      return null;
    case 4:
      if (base.images.length === 0)
        return 'At least one photo is required — it helps your ad stand out.';
      if ((base.category === 'jobs' || base.category === 'services') && !base.description.trim())
        return 'Please add a description for this type of listing.';
      return null;
    default:
      return null;
  }
};

// ─── Main Component ───────────────────────────────────────────────────────────

const PostAdModal: React.FC<PostAdModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<StepError>(null);

  const [base, setBase] = useState<BaseForm>(INIT_BASE);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [autoD, setAutoD] = useState<AutoDetails>(INIT_AUTO);
  const [reD, setReD] = useState<RealEstateDetails>(INIT_RE);
  const [jobD, setJobD] = useState<JobDetails>(INIT_JOB);
  const [svcD, setSvcD] = useState<ServiceDetails>(INIT_SVC);

  // ── Draft restore on open ────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const { b, a, re, j, s } = JSON.parse(raw);
      if (b) setBase({ ...INIT_BASE, ...b, images: [] });
      if (a) setAutoD({ ...INIT_AUTO, ...a });
      if (re) setReD({ ...INIT_RE, ...re });
      if (j) setJobD({ ...INIT_JOB, ...j });
      if (s) setSvcD({ ...INIT_SVC, ...s });
    } catch {/* ignore */ }
  }, [isOpen]);

  // ── Auto-save draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({
          b: { ...base, images: [] }, a: autoD, re: reD, j: jobD, s: svcD,
        }));
      } catch {/* ignore */ }
    }, 800);
    return () => clearTimeout(t);
  }, [isOpen, base, autoD, reD, jobD, svcD]);

  // ── Clear step error when user changes step or fixes inputs ───────────────
  useEffect(() => { setStepError(null); }, [step, base, svcD]);

  // ── Escape key ───────────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    if (isOpen) window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const reset = useCallback(() => {
    setBase(INIT_BASE); setImageFiles([]); setAutoD(INIT_AUTO); setReD(INIT_RE); setJobD(INIT_JOB); setSvcD(INIT_SVC);
    setStep(1); setIsLoading(false); setIsSuccess(false); setStepError(null); setSubmitError(null);
  }, []);

  const handleClose = () => { onClose(); setTimeout(reset, 300); };

  const handleBaseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBase(prev => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (updater: (prev: string[]) => string[]) => {
    setBase(prev => ({ ...prev, images: updater(prev.images) }));
  };

  const canProceed = (): boolean => validateStep(step, base, svcD) === null;

  const handleNext = () => {
    const error = validateStep(step, base, svcD);
    if (error) { setStepError(error); return; }
    setStepError(null);
    setStep(prev => (prev + 1) as Step);
  };

  const handleCategorySelect = useCallback((cat: Category) => {
    setBase(prev => ({ ...prev, category: cat }));
  }, []);

  const buildDetails = () => {
    switch (base.category) {
      case 'auto': return { ...autoD, description: base.description };
      case 'real-estate': return { ...reD, description: base.description };
      case 'jobs': return { ...jobD, description: base.description };
      case 'services': return { ...svcD, description: base.description };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    const error = validateStep(step, base, svcD);
    if (error) { setStepError(error); return; }

    setIsLoading(true);
    try {
      const adData: PostAdFormData = {
        title: base.title,
        description: base.description,
        category: base.category,
        price: Number(base.price) || 0,
        currency: base.priceUnit,
        location: base.location,
        details: buildDetails(),
      };
      await onSubmit(adData, imageFiles);

      localStorage.removeItem(DRAFT_KEY);
      setIsSuccess(true);
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to publish your ad. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const cfg = CATEGORY_CONFIG[base.category];

  return (
    <div className="fixed inset-0 z-100 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="post-ad-title">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl transition-opacity" onClick={handleClose} />

      <div className="flex min-h-full items-center justify-center p-6">
        <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-none transform transition-all">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-8 py-6 border-none bg-white/80 backdrop-blur-xl sticky top-0 z-20">
            <div>
              <h3 id="post-ad-title" className="text-xl font-black text-slate-900 tracking-tighter">
                {isSuccess ? 'AD PUBLISHED!' : 'POST A NEW AD'}
              </h3>
              {!isSuccess && (
                <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">
                  Step {step} of 4 — {STEP_LABELS[step]}
                </p>
              )}
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={handleClose}
              className="p-2.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Progress strip ──────────────────────────────────────────── */}
          {!isSuccess && (
            <div className="px-8 pt-2 pb-2">
              <div className="flex gap-2">
                {([1, 2, 3, 4] as Step[]).map(s => (
                  <div
                    key={s}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-150 ease-out ${
                      s <= step ? `${cfg.bar} shadow-sm ${cfg.barShadow}` : 'bg-slate-100'
                    } ${s === step ? `ring-2 ${cfg.ring} ring-opacity-20` : ''}`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-3">
                {(['Category', 'Basic Info', 'Details', 'Photo'] as const).map((label, i) => (
                  <span key={label} className={`text-[9px] font-black uppercase tracking-widest transition-colors duration-150 ${i + 1 === step ? cfg.text : 'text-slate-300'}`}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Body ────────────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-5 max-h-[58vh] overflow-y-auto">
              {isSuccess ? (
                <>
                  {/* ─ Success state ─ */}
                <div className="flex flex-col items-center gap-6 py-10 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-apple-blue/5 rounded-full blur-3xl -z-10" />
                  <div className="w-20 h-20 rounded-full bg-apple-blue flex items-center justify-center text-white shadow-xl shadow-apple-blue/20 relative">
                    <CheckCircle className="w-10 h-10" />
                    <div className="absolute inset-0 rounded-full border-4 border-apple-blue/20 animate-ping" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tighter">AD PUBLISHED!</h4>
                    <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto font-medium">
                      Your listing is now live and visible to everyone on Daberli.
                    </p>
                  </div>
                  {base.images[0] && (
                    <div className="w-full rounded-4xl overflow-hidden aspect-video bg-slate-100 shadow-2xl">
                      <img src={base.images[0]} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="apple-card w-full bg-slate-50 border-none px-6 py-4 text-left">
                    <p className="font-black text-xs uppercase tracking-widest text-slate-900">{base.title || 'Your listing'}</p>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-tight mt-1.5">
                      {base.location} · {base.price ? `${Number(base.price).toLocaleString()} ${base.priceUnit}` : 'Price not set'}
                      {base.images.length > 1 && ` · ${base.images.length} photos`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className={`apple-button w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-white ${cfg.btn} shadow-lg ${cfg.btnShadow} transition-colors duration-150`}
                  >
                    Done
                  </button>
                </div>
                </>
              ) : (
                <>
                  {step === 1 && (
                    <StepCategory
                      selected={base.category}
                      onSelect={handleCategorySelect}
                    />
                  )}
                  {step === 2 && <StepBasic data={base} onChange={handleBaseChange} />}
                  {step === 3 && (
                    <>
                      {base.category === 'auto' && <StepAutoDetails d={autoD} set={(k, v) => setAutoD(p => ({ ...p, [k]: v }))} />}
                      {base.category === 'real-estate' && <StepRealEstateDetails d={reD} set={(k, v) => setReD(p => ({ ...p, [k]: v }))} />}
                      {base.category === 'jobs' && <StepJobDetails d={jobD} set={(k, v) => setJobD(p => ({ ...p, [k]: v }))} />}
                      {base.category === 'services' && <StepServiceDetails d={svcD} set={(k, v) => setSvcD(p => ({ ...p, [k]: v }))} />}
                    </>
                  )}
                  {step === 4 && (
                    <StepPhoto
                      base={base}
                      onDescChange={v => setBase(prev => ({ ...prev, description: v }))}
                      onImagesChange={handleImagesChange}
                      onFileAdd={(file) => setImageFiles(prev => [...prev, file])}
                      onFileRemove={(idx) => setImageFiles(prev => prev.filter((_, i) => i !== idx))}
                    />
                  )}

                  {/* ── Step error banner ──────────────────────────────── */}
                  {stepError && (
                    <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-3 py-2.5 rounded-xl">
                      <X className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      {stepError}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Footer ─────────────────────────────────────────────────── */}
            {!isSuccess && submitError && (
              <div className="mx-6 mb-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                {submitError}
              </div>
            )}
            {!isSuccess && (
              <div className="px-8 pb-8 pt-4 bg-white/80 backdrop-blur-xl flex items-center gap-4 sticky bottom-0 z-20">
                {/* Back button */}
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(prev => (prev - 1) as Step)}
                    className="apple-button flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                ) : (
                  <div className="flex-0" />
                )}

                {/* Continue / Publish */}
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={`apple-button flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white ${cfg.btn} shadow-lg ${cfg.btnShadow} transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading || !canProceed()}
                    className={`apple-button flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white ${cfg.btn} shadow-lg ${cfg.btnShadow} transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {isLoading
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing…</>
                      : <><CheckCircle className="w-4 h-4" /> Publish Ad</>}
                  </button>
                )}
              </div>
            )}
          </form>

          {/* Draft hint */}
          {!isSuccess && (
            <p className="text-center text-[10px] text-gray-300 pb-3 -mt-1">
              Draft auto-saved
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostAdModal;
