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
  onSubmit: (adData: any) => void;
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
    btn: 'bg-red-600 hover:bg-red-700',
    badge: 'bg-red-100 text-red-700',
    bar: 'bg-red-500',
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
    btn: 'bg-emerald-600 hover:bg-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
    bar: 'bg-emerald-500',
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
    btn: 'bg-blue-600 hover:bg-blue-700',
    badge: 'bg-blue-100 text-blue-700',
    bar: 'bg-blue-500',
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
    btn: 'bg-violet-600 hover:bg-violet-700',
    badge: 'bg-violet-100 text-violet-700',
    bar: 'bg-violet-500',
  },
} as const;

// ─── Small reusable pieces ────────────────────────────────────────────────────

const FieldWrapper: React.FC<{
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  hint?: string;
}> = ({ label, icon, children, hint }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      {icon && (
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {icon}
        </span>
      )}
      {children}
    </div>
    {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
  </div>
);

const inputCls = (hasIcon = true) =>
  `block w-full ${hasIcon ? 'pl-10' : 'px-3'} pr-3 py-2.5 border border-gray-200 rounded-xl
   text-gray-900 placeholder-gray-400 text-sm bg-white
   focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all`;

const selectCls = (hasIcon = true) => `${inputCls(hasIcon)} appearance-none cursor-pointer`;

const DownIcon = () => (
  <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
    <ChevronDown className="w-4 h-4" />
  </span>
);

// ─── Step 1 — Category Picker ─────────────────────────────────────────────────

const StepCategory: React.FC<{
  selected: Category;
  onSelect: (c: Category) => void;
}> = ({ selected, onSelect }) => (
  <div className="space-y-3">
    <p className="text-sm text-gray-500 mb-1">What are you listing?</p>
    <div className="grid grid-cols-2 gap-3">
      {(Object.entries(CATEGORY_CONFIG) as [Category, typeof CATEGORY_CONFIG[Category]][]).map(([cat, cfg]) => {
        const active = selected === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat)}
            className={`flex flex-col items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 ${cfg.ring}
              ${active ? `${cfg.border} ${cfg.bg} ring-2 ${cfg.ring} ring-offset-1` : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}
          >
            <span className={active ? cfg.text : 'text-gray-400'}>{cfg.icon}</span>
            <span>
              <p className={`font-bold text-sm ${active ? cfg.text : 'text-gray-800'}`}>{cfg.label}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-snug">{cfg.subtitle}</p>
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

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
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${cfg.badge}`}>
        {cfg.iconSm}{cfg.label}
      </div>

      {/* Title */}
      <FieldWrapper label="Ad Title *" icon={<Type className="w-4 h-4" />}>
        <input
          autoFocus
          type="text"
          name="title"
          required
          value={data.title}
          onChange={onChange}
          placeholder={placeholder}
          className={inputCls()}
        />
      </FieldWrapper>

      {/* Wilaya */}
      <FieldWrapper label="Wilaya *" icon={<MapPin className="w-4 h-4" />}>
        <select name="location" required value={data.location} onChange={onChange} className={selectCls()}>
          <option value="">Choose wilaya</option>
          {WILAYAS.map((w) => (
            <option key={w.code} value={w.name}>{w.code} — {w.name}</option>
          ))}
        </select>
        <DownIcon />
      </FieldWrapper>

      {/* Price + unit */}
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="Price (DZD)" icon={<DollarSign className="w-4 h-4" />}>
          <input
            type="number"
            name="price"
            min="0"
            value={data.price}
            onChange={onChange}
            placeholder="0"
            className={inputCls()}
          />
        </FieldWrapper>
        <FieldWrapper label="Pricing type">
          <select name="priceUnit" value={data.priceUnit} onChange={onChange} className={selectCls(false)}>
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
  const ch = (k: keyof AutoDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => set(k, e.target.value);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="Brand" icon={<Car className="w-4 h-4" />}>
          <select value={d.brand} onChange={ch('brand')} className={selectCls()}>
            <option value="">Select brand</option>
            {['Renault','Peugeot','Citroën','Volkswagen','Toyota','Hyundai','Kia','Dacia','BMW','Mercedes-Benz','Audi','Ford','Fiat','Opel','Seat','Skoda','Suzuki','Nissan','Honda','Mitsubishi','Mazda','Other'].map(b => <option key={b}>{b}</option>)}
          </select>
          <DownIcon />
        </FieldWrapper>
        <FieldWrapper label="Model" icon={<Tag className="w-4 h-4" />}>
          <input value={d.model} onChange={ch('model')} placeholder="e.g., Clio 4" className={inputCls()} />
        </FieldWrapper>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="Year" icon={<Calendar className="w-4 h-4" />}>
          <select value={d.year} onChange={ch('year')} className={selectCls()}>
            <option value="">Year</option>
            {Array.from({ length: 37 }, (_, i) => 2026 - i).map(y => <option key={y}>{y}</option>)}
          </select>
          <DownIcon />
        </FieldWrapper>
        <FieldWrapper label="Mileage (km)" icon={<Gauge className="w-4 h-4" />}>
          <input type="number" min="0" value={d.mileage} onChange={ch('mileage')} placeholder="e.g., 45 000" className={inputCls()} />
        </FieldWrapper>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="Fuel type" icon={<Fuel className="w-4 h-4" />}>
          <select value={d.fuelType} onChange={ch('fuelType')} className={selectCls()}>
            <option value="">Select</option>
            {['Essence','Gasoil','GPL','Électrique','Hybride'].map(f => <option key={f}>{f}</option>)}
          </select>
          <DownIcon />
        </FieldWrapper>
        <FieldWrapper label="Transmission" icon={<Zap className="w-4 h-4" />}>
          <select value={d.transmission} onChange={ch('transmission')} className={selectCls()}>
            <option value="">Select</option>
            <option>Manual</option>
            <option>Automatic</option>
          </select>
          <DownIcon />
        </FieldWrapper>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="Color" icon={<Palette className="w-4 h-4" />}>
          <input value={d.color} onChange={ch('color')} placeholder="e.g., White" className={inputCls()} />
        </FieldWrapper>
        <FieldWrapper label="Condition" icon={<CheckCircle className="w-4 h-4" />}>
          <select value={d.condition} onChange={ch('condition')} className={selectCls()}>
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
  const ch = (k: keyof RealEstateDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => set(k, e.target.value);
  return (
    <div className="space-y-4">
      <FieldWrapper label="Property type" icon={<Home className="w-4 h-4" />}>
        <select value={d.type} onChange={ch('type')} className={selectCls()}>
          <option value="">Select type</option>
          {['Appartement','Villa','Studio','Bureau','Local commercial','Terrain','Maison','Duplex','Penthouse'].map(t => <option key={t}>{t}</option>)}
        </select>
        <DownIcon />
      </FieldWrapper>

      <div className="grid grid-cols-3 gap-3">
        <FieldWrapper label="Area (m²)" icon={<Square className="w-4 h-4" />}>
          <input type="number" min="1" value={d.area} onChange={ch('area')} placeholder="m²" className={inputCls()} />
        </FieldWrapper>
        <FieldWrapper label="Bedrooms" icon={<BedDouble className="w-4 h-4" />}>
          <select value={d.bedrooms} onChange={ch('bedrooms')} className={selectCls()}>
            <option value="">—</option>
            {['Studio','1','2','3','4','5','6+'].map(n => <option key={n}>{n}</option>)}
          </select>
          <DownIcon />
        </FieldWrapper>
        <FieldWrapper label="Bathrooms" icon={<Bath className="w-4 h-4" />}>
          <select value={d.bathrooms} onChange={ch('bathrooms')} className={selectCls()}>
            <option value="">—</option>
            {['1','2','3','4+'].map(n => <option key={n}>{n}</option>)}
          </select>
          <DownIcon />
        </FieldWrapper>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="Floor" icon={<Building2 className="w-4 h-4" />}>
          <select value={d.floor} onChange={ch('floor')} className={selectCls()}>
            <option value="">Select</option>
            {['Rez-de-chaussée','1er étage','2ème étage','3ème étage','4ème étage','5ème étage','6ème+ étage','Dernier étage'].map(f => <option key={f}>{f}</option>)}
          </select>
          <DownIcon />
        </FieldWrapper>
        <FieldWrapper label="Furnished" icon={<CheckCircle className="w-4 h-4" />}>
          <select value={d.furnished} onChange={ch('furnished')} className={selectCls()}>
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
  const ch = (k: keyof JobDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => set(k, e.target.value);
  return (
    <div className="space-y-4">
      <FieldWrapper label="Company name" icon={<Building2 className="w-4 h-4" />}>
        <input value={d.company} onChange={ch('company')} placeholder="e.g., Sonatrach, Ooredoo, Freelance" className={inputCls()} />
      </FieldWrapper>
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="Contract type" icon={<Briefcase className="w-4 h-4" />}>
          <select value={d.jobType} onChange={ch('jobType')} className={selectCls()}>
            <option value="">Select</option>
            {['CDI','CDD','Freelance','Stage','Intérim','Temps partiel'].map(t => <option key={t}>{t}</option>)}
          </select>
          <DownIcon />
        </FieldWrapper>
        <FieldWrapper label="Work mode" icon={<MapPin className="w-4 h-4" />}>
          <select value={d.remote} onChange={ch('remote')} className={selectCls()}>
            <option value="">Select</option>
            {['Présentiel','Remote','Hybride'].map(m => <option key={m}>{m}</option>)}
          </select>
          <DownIcon />
        </FieldWrapper>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="Experience required" icon={<Clock className="w-4 h-4" />}>
          <select value={d.experience} onChange={ch('experience')} className={selectCls()}>
            <option value="">Select</option>
            {['Débutant (0–1 an)','1–3 ans','3–5 ans','5–10 ans','10+ ans'].map(e => <option key={e}>{e}</option>)}
          </select>
          <DownIcon />
        </FieldWrapper>
        <FieldWrapper label="Sector / Industry" icon={<Tag className="w-4 h-4" />}>
          <input value={d.sector} onChange={ch('sector')} placeholder="e.g., IT, BTP, Finance" className={inputCls()} />
        </FieldWrapper>
      </div>
    </div>
  );
};

const StepServiceDetails: React.FC<{
  d: ServiceDetails;
  set: (k: keyof ServiceDetails, v: string) => void;
}> = ({ d, set }) => {
  const ch = (k: keyof ServiceDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => set(k, e.target.value);
  return (
    <div className="space-y-4">
      <FieldWrapper label="Specialty / Trade *" icon={<Wrench className="w-4 h-4" />}>
        <input value={d.specialty} onChange={ch('specialty')} placeholder="e.g., Plomberie, Web Design, Cours de Maths" className={inputCls()} />
      </FieldWrapper>
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="Rate type" icon={<DollarSign className="w-4 h-4" />}>
          <select value={d.rateType} onChange={ch('rateType')} className={selectCls()}>
            <option value="">Select</option>
            <option>Prix fixe</option>
            <option>Par heure</option>
            <option>Par jour</option>
            <option>Par projet</option>
            <option>Négociable</option>
          </select>
          <DownIcon />
        </FieldWrapper>
        <FieldWrapper label="Years of experience" icon={<Calendar className="w-4 h-4" />}>
          <select value={d.yearsExp} onChange={ch('yearsExp')} className={selectCls()}>
            <option value="">Select</option>
            {['Moins d\'1 an','1–3 ans','3–5 ans','5–10 ans','10+ ans'].map(y => <option key={y}>{y}</option>)}
          </select>
          <DownIcon />
        </FieldWrapper>
      </div>
      <FieldWrapper label="Availability" icon={<Clock className="w-4 h-4" />}>
        <select value={d.availability} onChange={ch('availability')} className={selectCls()}>
          <option value="">Select</option>
          {['Immédiat','Week-ends uniquement','Semaine uniquement','Soirs uniquement','Flexible'].map(a => <option key={a}>{a}</option>)}
        </select>
        <DownIcon />
      </FieldWrapper>
      <FieldWrapper label="Contact phone (optional)" icon={<Phone className="w-4 h-4" />}>
        <input type="tel" placeholder="+213 5xx xx xx xx" className={inputCls()} />
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
}> = ({ base, onDescChange, onImagesChange }) => {
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
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center gap-3">
        <span className={`p-2 rounded-lg ${cfg.bg} ${cfg.text}`}>{cfg.iconSm}</span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {base.title || 'Untitled Ad'}
          </p>
          <p className="text-xs text-gray-500">
            {base.location || 'No wilaya'} ·{' '}
            {base.price ? `${Number(base.price).toLocaleString()} ${base.priceUnit}` : 'No price'}
          </p>
        </div>
      </div>

      {/* Photos — Hero + Filmstrip layout */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
            <ImageIcon className="w-4 h-4" />
            Photos <span className="text-red-400">*</span>
          </label>
          <span className="text-xs text-gray-400 font-medium">{base.images.length} / {MAX_IMAGES}</span>
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
                    className={`relative shrink-0 w-20 aspect-square rounded-lg overflow-hidden bg-gray-100 group cursor-grab active:cursor-grabbing transition-all duration-200
                      ${isDragging ? 'opacity-50 scale-95' : ''}
                      ${isDropTarget ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
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
                  className="shrink-0 w-20 aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50"
                >
                  <div className="relative w-8 h-8">
                    <svg className="animate-spin" viewBox="0 0 36 36">
                      <circle
                        className="text-gray-200"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        cx="18"
                        cy="18"
                        r="14"
                      />
                      <circle
                        className="text-blue-500"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        cx="18"
                        cy="18"
                        r="14"
                        strokeDasharray="88"
                        strokeDashoffset="66"
                        strokeLinecap="round"
                      />
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
                  className={`shrink-0 w-20 aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer select-none transition-colors
                    ${dragOver ? 'border-blue-400 bg-blue-50 text-blue-500' : 'border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500'}`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-[9px] font-semibold">Add</span>
                </div>
              )}
            </div>
          </div>
        ) : loadingCount > 0 ? (
          /* Loading state */
          <div className="w-full border-2 border-dashed border-blue-300 bg-blue-50 rounded-xl py-10 flex flex-col items-center gap-3">
            <div className="relative w-12 h-12">
              <svg className="animate-spin" viewBox="0 0 36 36">
                <circle className="text-blue-200" stroke="currentColor" strokeWidth="4" fill="none" cx="18" cy="18" r="14" />
                <circle className="text-blue-500" stroke="currentColor" strokeWidth="4" fill="none" cx="18" cy="18" r="14"
                  strokeDasharray="88" strokeDashoffset="66" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm font-medium text-blue-600">Processing {loadingCount} photo{loadingCount > 1 ? 's' : ''}…</span>
            <span className="text-xs text-blue-400">Compressing for optimal quality</span>
          </div>
        ) : (
          /* Full drop zone when no images yet */
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); processFiles(e.dataTransfer.files); }}
            onClick={() => fileRef.current?.click()}
            className={`w-full border-2 border-dashed rounded-xl py-10 flex flex-col items-center gap-2 cursor-pointer select-none transition-colors
              ${dragOver ? 'border-blue-400 bg-blue-50 text-blue-500' : 'border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500'}`}
          >
            <ImageIcon className="w-8 h-8" />
            <span className="text-sm font-medium">Click or drag & drop photos here</span>
            <span className="text-xs">JPG · PNG · WEBP — max {MAX_FILE_MB} MB each · up to {MAX_IMAGES} photos</span>
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
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Description{' '}
          {base.category === 'jobs' || base.category === 'services'
            ? <span className="text-red-400">*</span>
            : <span className="text-gray-400 font-normal">(optional)</span>}
        </label>
        <div className="relative">
          <span className="absolute top-3 left-3 text-gray-400 pointer-events-none">
            <AlignLeft className="w-4 h-4" />
          </span>
          <textarea
            rows={4}
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
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900
              placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
          />
          <p className="mt-1 text-xs text-gray-400 text-right">{base.description.length} / 1000</p>
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
  const [stepError, setStepError] = useState<StepError>(null);

  const [base, setBase] = useState<BaseForm>(INIT_BASE);
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
    setBase(INIT_BASE); setAutoD(INIT_AUTO); setReD(INIT_RE); setJobD(INIT_JOB); setSvcD(INIT_SVC);
    setStep(1); setIsLoading(false); setIsSuccess(false); setStepError(null);
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

  const buildDetails = () => {
    switch (base.category) {
      case 'auto': return { ...autoD };
      case 'real-estate': return { ...reD };
      case 'jobs': return { ...jobD, description: base.description };
      case 'services': return { ...svcD, description: base.description };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Guard every step before submit — future-proof: adding a new step only requires updating validateStep
    for (let s = 1; s <= 4; s++) {
      const error = validateStep(s as Step, base, svcD);
      if (error) { setStep(s as Step); setStepError(error); return; }
    }
    setIsLoading(true);
    setTimeout(() => {
      onSubmit({
        title: base.title,
        category: base.category,
        price: Number(base.price) || 0,
        currency: base.priceUnit,
        location: base.location,
        image: base.images[0],   // cover
        images: [...base.images],  // full gallery
        details: buildDetails(),
        datePosted: 'Just now',
      });
      localStorage.removeItem(DRAFT_KEY);
      setIsLoading(false);
      setIsSuccess(true);
    }, 1400);
  };

  if (!isOpen) return null;

  const cfg = CATEGORY_CONFIG[base.category];

  return (
    <div className="fixed inset-0 z-100 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="post-ad-title">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
            <div>
              <h3 id="post-ad-title" className="text-base font-bold text-gray-900">
                {isSuccess ? 'Ad published!' : 'Post a New Ad'}
              </h3>
              {!isSuccess && (
                <p className="text-xs text-gray-400 mt-0.5">
                  Step {step} / 4 — {STEP_LABELS[step]}
                </p>
              )}
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={handleClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Progress strip ──────────────────────────────────────────── */}
          {!isSuccess && (
            <div className="px-6 pt-4 pb-1">
              <div className="flex gap-1.5">
                {([1, 2, 3, 4] as Step[]).map(s => (
                  <div
                    key={s}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? cfg.bar : 'bg-gray-200'}`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                {(['Category', 'Basic Info', 'Details', 'Photo'] as const).map((label, i) => (
                  <span key={label} className={`text-[10px] font-medium ${i + 1 === step ? cfg.text : 'text-gray-400'}`}>
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
                /* ─ Success state ─ */
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${cfg.bg} ${cfg.text}`}>
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Ad published successfully!</h4>
                    <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                      Your listing is now live and visible to everyone on Daberli.
                    </p>
                  </div>
                  {base.images[0] && (
                    <div className="w-full rounded-xl overflow-hidden aspect-video bg-gray-100">
                      <img src={base.images[0]} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className={`w-full ${cfg.bg} border ${cfg.border} rounded-xl px-4 py-3 text-sm text-left`}>
                    <p className={`font-semibold ${cfg.text}`}>{base.title || 'Your listing'}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {base.location} · {base.price ? `${Number(base.price).toLocaleString()} ${base.priceUnit}` : 'Price not set'}
                      {base.images.length > 1 && ` · ${base.images.length} photos`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold text-white transition-colors ${cfg.btn}`}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {step === 1 && (
                    <StepCategory
                      selected={base.category}
                      onSelect={cat => setBase(prev => ({ ...prev, category: cat }))}
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
            {!isSuccess && (
              <div className="px-6 pb-5 pt-3 border-t border-gray-100 flex items-center gap-3">
                {/* Back button */}
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(prev => (prev - 1) as Step)}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {/* Continue / Publish */}
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-colors
                      disabled:opacity-40 disabled:cursor-not-allowed ${cfg.btn}`}
                  >
                    Continue <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading || !canProceed()}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-colors
                      disabled:opacity-40 disabled:cursor-not-allowed ${cfg.btn}`}
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
