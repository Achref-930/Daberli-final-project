import {
  AlertTriangle,
  Bell,
  Car,
  Check,
  ChevronRight,
  Globe,
  Home,
  Languages,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Moon,
  Phone,
  Save,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Star,
  Sun,
  SunMoon,
  Trash2,
  User as UserIcon,
  UserX,
  X,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { WILAYAS } from '../constants';
import { User } from '../types';

// ---------------------------------------------------------------------------
// Helper components
// ---------------------------------------------------------------------------

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }> = ({
  checked,
  onChange,
  disabled = false,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => !disabled && onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
      disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
    } ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
  >
    <span
      className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  iconBg: string;
  children: React.ReactNode;
}
const Section: React.FC<SectionProps> = ({ icon, title, subtitle, iconBg, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="px-6 pt-6 pb-4 border-b border-gray-50 flex items-center gap-3">
      <div className={`p-2.5 rounded-xl ${iconBg}`}>{icon}</div>
      <div>
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
    <div className="divide-y divide-gray-50">{children}</div>
  </div>
);

interface RowProps {
  icon?: React.ReactNode;
  iconBg?: string;
  label: string;
  description?: string;
  action: React.ReactNode;
}
const Row: React.FC<RowProps> = ({ icon, iconBg, label, description, action }) => (
  <div className="flex items-center justify-between px-6 py-4 gap-4">
    <div className="flex items-center gap-3 min-w-0">
      {icon && <div className={`p-2 rounded-xl shrink-0 ${iconBg}`}>{icon}</div>}
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
    </div>
    <div className="shrink-0">{action}</div>
  </div>
);

const ComingSoonBadge = () => (
  <span className="px-3 py-1 rounded-full text-xs font-medium border border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed select-none">
    Soon
  </span>
);

// ---------------------------------------------------------------------------
// Danger confirmation modal
// ---------------------------------------------------------------------------
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  danger = true,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full p-6 z-10">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${danger ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-colors ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-500 hover:bg-amber-600'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Change Password mini-modal
// ---------------------------------------------------------------------------
const ChangePasswordModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!current) return setError('Enter your current password.');
    if (next.length < 8) return setError('New password must be at least 8 characters.');
    if (next !== confirm) return setError('Passwords do not match.');
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); setCurrent(''); setNext(''); setConfirm(''); }, 1500);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full p-6 z-10">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mb-4">
          <Lock className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
        {saved ? (
          <div className="flex flex-col items-center gap-2 py-6">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Check className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-gray-700">Password updated!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-600">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Current Password</label>
              <input
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
              <input
                type="password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Min. 8 characters"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface SettingsPageProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onPostAdClick: () => void;
  onUpdateUser: (updates: Partial<User>) => void;
  selectedWilaya: string;
  onWilayaChange: (wilaya: string) => void;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  onSignIn,
  onSignOut,
  onPostAdClick,
  onUpdateUser,
  selectedWilaya,
  onWilayaChange,
}) => {

  // ── Account ──────────────────────────────────────────────────────────────
  const [phone, setPhone] = useState('');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [draftPhone, setDraftPhone] = useState('');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // ── Notifications ─────────────────────────────────────────────────────────
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [adStatusAlerts, setAdStatusAlerts] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // ── Privacy ───────────────────────────────────────────────────────────────
  const [publicProfile, setPublicProfile] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [appOnlyContact, setAppOnlyContact] = useState(true);

  // ── Language & Region ─────────────────────────────────────────────────────
  const [language, setLanguage] = useState<'en' | 'fr' | 'ar'>('en');
  const [defaultWilaya, setDefaultWilaya] = useState('');

  // ── Appearance ────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

  // ── Ad Preferences ────────────────────────────────────────────────────────
  const [defaultCategory, setDefaultCategory] = useState('');

  // ── Danger Zone ───────────────────────────────────────────────────────────
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deactivated, setDeactivated] = useState(false);

  // ── Save feedback ─────────────────────────────────────────────────────────
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const showSaved = (section: string) => {
    setSavedSection(section);
    setTimeout(() => setSavedSection(null), 2000);
  };


  // ---------------------------------------------------------------------------
  // Unauthenticated guard
  // ---------------------------------------------------------------------------
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          user={user}
          onSignIn={onSignIn}
          onSignOut={onSignOut}
          onPostAd={onPostAdClick}
          selectedWilaya={selectedWilaya}
          onWilayaChange={onWilayaChange}
          showBackButton
        />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-600 mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sign in required</h1>
          <p className="text-gray-500 mt-2">Please sign in to access your settings.</p>
          <button onClick={onSignIn} className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' },
  ] as const;

  const themes = [
    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
    { value: 'system', label: 'System', icon: <SunMoon className="w-4 h-4" /> },
  ] as const;

  const categories = [
    { value: '', label: 'No preference' },
    { value: 'auto', label: 'Auto' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'jobs', label: 'Jobs' },
    { value: 'services', label: 'Services' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={user}
        onSignIn={onSignIn}
        onSignOut={onSignOut}
        onPostAd={onPostAdClick}
        selectedWilaya={selectedWilaya}
        onWilayaChange={onWilayaChange}
        showBackButton
      />
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your account preferences</p>
          </div>
          <Link
            to="/profile"
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <UserIcon className="w-4 h-4" />
            View Profile
          </Link>
        </div>

        {/* Deactivation notice */}
        {deactivated && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-amber-800 text-sm font-medium">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
            Your account has been deactivated. Sign in again to reactivate.
          </div>
        )}

        {/* ── 1. ACCOUNT ─────────────────────────────────────────────────── */}
        <Section
          icon={<UserIcon className="w-5 h-5 text-blue-600" />}
          title="Account"
          subtitle="Your identity and credentials"
          iconBg="bg-blue-50"
        >
          {/* Display Name */}
          <Row
            icon={<UserIcon className="w-4 h-4 text-blue-600" />}
            iconBg="bg-blue-50"
            label="Display Name"
            description={user.name}
            action={
              <Link
                to="/profile"
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Edit <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            }
          />

          {/* Email */}
          <Row
            icon={<Mail className="w-4 h-4 text-gray-500" />}
            iconBg="bg-gray-100"
            label="Email Address"
            description={user.email}
            action={<ComingSoonBadge />}
          />

          {/* Phone */}
          <div className="flex items-center justify-between px-6 py-4 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl shrink-0 bg-emerald-50">
                <Phone className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800">Phone Number</p>
                {isEditingPhone ? (
                  <input
                    type="tel"
                    value={draftPhone}
                    onChange={(e) => setDraftPhone(e.target.value)}
                    className="mt-1 text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 w-40"
                    placeholder="+213 555 000 000"
                    autoFocus
                  />
                ) : (
                  <p className="text-xs text-gray-400 mt-0.5">{phone || 'Not set'}</p>
                )}
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              {isEditingPhone ? (
                <>
                  <button
                    onClick={() => { setPhone(draftPhone.trim()); setIsEditingPhone(false); showSaved('phone'); }}
                    className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsEditingPhone(false)}
                    className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setDraftPhone(phone); setIsEditingPhone(true); }}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                >
                  {phone ? 'Edit' : 'Add'} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
              {savedSection === 'phone' && <Check className="w-4 h-4 text-emerald-500" />}
            </div>
          </div>

          {/* Change Password */}
          <Row
            icon={<Lock className="w-4 h-4 text-violet-600" />}
            iconBg="bg-violet-50"
            label="Password"
            description="Update your account password"
            action={
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
              >
                Change <ChevronRight className="w-3.5 h-3.5" />
              </button>
            }
          />

          {/* PRO Plan */}
          <Row
            icon={<Zap className="w-4 h-4 text-amber-500 fill-amber-500" />}
            iconBg="bg-amber-50"
            label="Subscription"
            description="PRO Plan — Active"
            action={
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> PRO
              </span>
            }
          />
        </Section>

        {/* ── 2. NOTIFICATIONS ───────────────────────────────────────────── */}
        <Section
          icon={<Bell className="w-5 h-5 text-violet-600" />}
          title="Notifications"
          subtitle="Choose what alerts you receive"
          iconBg="bg-violet-50"
        >
          <Row
            icon={<Mail className="w-4 h-4 text-blue-600" />}
            iconBg="bg-blue-50"
            label="Email Notifications"
            description="Receive updates about your listings via email"
            action={<Toggle checked={emailNotifications} onChange={setEmailNotifications} />}
          />
          <Row
            icon={<Smartphone className="w-4 h-4 text-violet-600" />}
            iconBg="bg-violet-50"
            label="Push Notifications"
            description="Get instant alerts on your device"
            action={<Toggle checked={pushNotifications} onChange={setPushNotifications} />}
          />
          <Row
            icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
            iconBg="bg-emerald-50"
            label="Ad Status Alerts"
            description="Notify me when my ad is approved or rejected"
            action={<Toggle checked={adStatusAlerts} onChange={setAdStatusAlerts} />}
          />
          <Row
            icon={<Bell className="w-4 h-4 text-blue-500" />}
            iconBg="bg-blue-50"
            label="New Message Alerts"
            description="Notify me when a buyer messages me"
            action={<Toggle checked={messageAlerts} onChange={setMessageAlerts} />}
          />
          <Row
            icon={<Globe className="w-4 h-4 text-gray-500" />}
            iconBg="bg-gray-100"
            label="Marketing Emails"
            description="Tips, featured listings, and platform news"
            action={<Toggle checked={marketingEmails} onChange={setMarketingEmails} />}
          />
        </Section>

        {/* ── 3. PRIVACY ─────────────────────────────────────────────────── */}
        <Section
          icon={<Shield className="w-5 h-5 text-emerald-600" />}
          title="Privacy"
          subtitle="Control who sees your information"
          iconBg="bg-emerald-50"
        >
          <Row
            icon={<Globe className="w-4 h-4 text-emerald-600" />}
            iconBg="bg-emerald-50"
            label="Public Profile"
            description="Allow other users to find and view your profile"
            action={<Toggle checked={publicProfile} onChange={setPublicProfile} />}
          />
          <Row
            icon={<Phone className="w-4 h-4 text-blue-500" />}
            iconBg="bg-blue-50"
            label="Show Phone Number"
            description="Display your phone on listings for direct contact"
            action={<Toggle checked={showPhone} onChange={setShowPhone} />}
          />
          <Row
            icon={<Lock className="w-4 h-4 text-gray-500" />}
            iconBg="bg-gray-100"
            label="In-App Contact Only"
            description="Buyers can only contact you through Daberli messages"
            action={<Toggle checked={appOnlyContact} onChange={setAppOnlyContact} />}
          />
        </Section>

        {/* ── 4. LANGUAGE & REGION ───────────────────────────────────────── */}
        <Section
          icon={<Languages className="w-5 h-5 text-blue-600" />}
          title="Language & Region"
          subtitle="Localise your experience"
          iconBg="bg-blue-50"
        >
          {/* Language Selector */}
          <div className="px-6 py-4">
            <p className="text-sm font-medium text-gray-800 mb-1">Interface Language</p>
            <p className="text-xs text-gray-400 mb-3">Select the language used across the platform</p>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    language === lang.code
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {lang.label}
                  {lang.code !== 'en' && (
                    <span className="ml-2 text-xs opacity-60 font-normal">Soon</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Default Wilaya */}
          <div className="px-6 py-4 border-t border-gray-50">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-gray-500" />
              <p className="text-sm font-medium text-gray-800">Default Wilaya</p>
            </div>
            <p className="text-xs text-gray-400 mb-2">Pre-fill your location when posting new ads</p>
            <select
              value={defaultWilaya}
              onChange={(e) => setDefaultWilaya(e.target.value)}
              className="w-full max-w-xs text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
            >
              <option value="">No preference</option>
              {WILAYAS.map((w) => (
                <option key={w.code} value={w.name}>
                  {w.code} — {w.name}
                </option>
              ))}
            </select>
          </div>
        </Section>

        {/* ── 5. APPEARANCE ──────────────────────────────────────────────── */}
        <Section
          icon={<Sun className="w-5 h-5 text-amber-500" />}
          title="Appearance"
          subtitle="Customise how Daberli looks"
          iconBg="bg-amber-50"
        >
          <div className="px-6 py-4">
            <p className="text-sm font-medium text-gray-800 mb-1">Theme</p>
            <p className="text-xs text-gray-400 mb-3">Choose a colour scheme for the interface</p>
            <div className="flex flex-wrap gap-2">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    theme === t.value
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
            {theme !== 'light' && (
              <p className="mt-3 text-xs text-amber-600 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Dark mode support coming soon — currently preview only.
              </p>
            )}
          </div>
        </Section>

        {/* ── 6. AD PREFERENCES ──────────────────────────────────────────── */}
        <Section
          icon={<Car className="w-5 h-5 text-slate-600" />}
          title="Ad Preferences"
          subtitle="Defaults when you create a new listing"
          iconBg="bg-slate-100"
        >
          {/* Default Category */}
          <div className="px-6 py-4">
            <div className="flex items-center gap-2 mb-1">
              <Home className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-medium text-gray-800">Default Category</p>
            </div>
            <p className="text-xs text-gray-400 mb-2">Pre-select a category when posting ads</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setDefaultCategory(c.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    defaultCategory === c.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-boost */}
          <Row
            icon={<Zap className="w-4 h-4 text-amber-500" />}
            iconBg="bg-amber-50"
            label="Auto-Boost New Listings"
            description="Automatically feature new ads at the top of results"
            action={<ComingSoonBadge />}
          />
        </Section>

        {/* ── 7. SECURITY ────────────────────────────────────────────────── */}
        <Section
          icon={<ShieldCheck className="w-5 h-5 text-blue-600" />}
          title="Security"
          subtitle="Protect your account"
          iconBg="bg-blue-50"
        >
          <Row
            icon={<ShieldCheck className="w-4 h-4 text-blue-600" />}
            iconBg="bg-blue-50"
            label="Two-Factor Authentication"
            description="Add an extra layer of sign-in security"
            action={<ComingSoonBadge />}
          />
          <Row
            icon={<Smartphone className="w-4 h-4 text-gray-500" />}
            iconBg="bg-gray-100"
            label="Active Sessions"
            description="1 active session — this device"
            action={<ComingSoonBadge />}
          />
          <Row
            icon={<LogOut className="w-4 h-4 text-red-500" />}
            iconBg="bg-red-50"
            label="Sign Out All Devices"
            description="Revoke access from all other sessions"
            action={<ComingSoonBadge />}
          />
        </Section>

        {/* ── 8. DANGER ZONE ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-red-50 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-50">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Danger Zone</h2>
              <p className="text-xs text-gray-500 mt-0.5">Irreversible account actions</p>
            </div>
          </div>

          {/* Deactivate */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-50">
                <UserX className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Deactivate Account</p>
                <p className="text-xs text-gray-400 mt-0.5">Hide your profile and listings temporarily</p>
              </div>
            </div>
            <button
              onClick={() => setShowDeactivateModal(true)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
            >
              Deactivate
            </button>
          </div>

          {/* Delete */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-50">
                <Trash2 className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Delete Account</p>
                <p className="text-xs text-gray-400 mt-0.5">Permanently erase all your data — cannot be undone</p>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="h-4" />
      </div>

      {/* Modals */}
      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
      <ConfirmModal
        isOpen={showDeactivateModal}
        title="Deactivate Account"
        message="Your profile and all your listings will be hidden until you sign in again."
        confirmLabel="Deactivate"
        danger={false}
        onConfirm={() => { setDeactivated(true); setShowDeactivateModal(false); onSignOut(); }}
        onCancel={() => setShowDeactivateModal(false)}
      />
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Account"
        message="This will permanently delete your account, all your listings, and your messages. This cannot be undone."
        confirmLabel="Delete Forever"
        onConfirm={() => { setShowDeleteModal(false); onSignOut(); }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default SettingsPage;
