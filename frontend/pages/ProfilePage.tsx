import {
  Camera,
  CheckCircle,
  ChevronRight,
  Edit3,
  Eye,
  Mail,
  Save,
  Settings,
  ShieldAlert,
  Star,
  User as UserIcon,
  X,
  Zap
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FloatingActionBar from '../components/FloatingActionBar';
import { handleImgError } from '../constants';
import { authAPI } from '../services/api';
import { Ad, User } from '../types';

// ---------------------------------------------------------------------------
// Mock review data (tied to the mock user id 'u123')
// ---------------------------------------------------------------------------
interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  date: string;
  category: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    reviewerName: 'Karim B.',
    reviewerAvatar: 'https://ui-avatars.com/api/?name=Karim+B&background=6366f1&color=fff&rounded=true&bold=true',
    rating: 5,
    comment: 'Very professional seller. The car was exactly as described and the handover was smooth. Highly recommend!',
    date: 'Feb 18, 2026',
    category: 'Auto'
  },
  {
    id: 'r2',
    reviewerName: 'Amina S.',
    reviewerAvatar: 'https://ui-avatars.com/api/?name=Amina+S&background=10b981&color=fff&rounded=true&bold=true',
    rating: 4,
    comment: 'Good experience overall. The property details were accurate and the seller was responsive.',
    date: 'Feb 10, 2026',
    category: 'Real Estate'
  },
  {
    id: 'r3',
    reviewerName: 'Youcef M.',
    reviewerAvatar: 'https://ui-avatars.com/api/?name=Youcef+M&background=f59e0b&color=fff&rounded=true&bold=true',
    rating: 5,
    comment: 'Excellent service! Fast replies, honest pricing, and a pleasure to deal with. Will buy from again.',
    date: 'Jan 28, 2026',
    category: 'Services'
  }
];

// ---------------------------------------------------------------------------
// Star rating helper
// ---------------------------------------------------------------------------
const StarRating: React.FC<{ rating: number; max?: number; size?: string }> = ({
  rating,
  max = 5,
  size = 'w-4 h-4'
}) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: max }).map((_, i) => (
      <Star
        key={i}
        className={`${size} ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-100'}`}
      />
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface ProfilePageProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onPostAdClick: () => void;
  ads: Ad[];
  onUpdateUser: (updates: Partial<User>) => void;
  selectedWilaya: string;
  onWilayaChange: (wilaya: string) => void;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onSignIn,
  onSignOut,
  onPostAdClick,
  ads,
  onUpdateUser,
  selectedWilaya,
  onWilayaChange,
}) => {
  // Edit-profile state
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState('');
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await authAPI.uploadAvatar(file);
      onUpdateUser({ avatar: data.avatar });
    } catch (err) {
      console.error('Failed to upload avatar:', err);
    }
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
          forceScrolled
        />
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-16 md:pt-32 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-600 mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sign in required</h1>
          <p className="text-gray-500 mt-2">Please sign in to view your profile.</p>
          <button
            onClick={onSignIn}
            className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
        <FloatingActionBar
          onHome={() => navigate('/')}
          onPostAd={onPostAdClick}
          onProfile={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Stats derived from ads
  // ---------------------------------------------------------------------------
  const getOwnerId = (ad: Ad) => typeof ad.postedByUserId === 'object' && ad.postedByUserId ? (ad.postedByUserId as any)._id : ad.postedByUserId;
  const myAds = ads.filter((ad) => getOwnerId(ad) === user.id);
  const approvedCount = myAds.filter((ad) => ad.approvalStatus === 'approved').length;
  const pendingCount = myAds.filter((ad) => ad.approvalStatus === 'pending').length;
  const rejectedCount = myAds.filter((ad) => ad.approvalStatus === 'rejected').length;

  // Reviews
  const userReviews = MOCK_REVIEWS; // In a real app, filter by seller id
  const avgRating =
    userReviews.length > 0
      ? userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length
      : 0;

  // Edit profile handlers
  const startEditing = () => {
    setDraftName(user.name);
    setIsEditing(true);
  };

  const cancelEditing = () => setIsEditing(false);

  const saveEditing = async () => {
    const trimmed = draftName.trim();
    if (!trimmed || !user) return;
    try {
      // Optimistically update UI
      onUpdateUser({ name: trimmed });
      setIsEditing(false);
      // Make API call
      await authAPI.updateProfile({ name: trimmed });
    } catch (err) {
      console.error('Failed to update name:', err);
      // Revert on error
      onUpdateUser({ name: user.name });
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-brand-surface">
      <Navbar
        user={user}
        onSignIn={onSignIn}
        onSignOut={onSignOut}
        onPostAd={onPostAdClick}
        selectedWilaya={selectedWilaya}
        onWilayaChange={onWilayaChange}
        showBackButton
        forceScrolled
      />

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-20 md:pt-32 space-y-8">

        {/* ------------------------------------------------------------------ */}
        {/* Profile Header                                                       */}
        {/* ------------------------------------------------------------------ */}
        <div className="apple-card p-8 md:p-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0 group">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-28 h-28 rounded-full object-cover ring-4 ring-apple-blue/10 shadow-xl"
                onError={handleImgError}
              />
              {/* Online indicator */}
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full" />
              {/* Upload overlay */}
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              {/* Name row */}
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 mb-1">
                {isEditing ? (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEditing();
                        if (e.key === 'Escape') cancelEditing();
                      }}
                      autoFocus
                      className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent w-full sm:w-48"
                    />
                    <button
                      onClick={saveEditing}
                      className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      title="Save"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                    <button
                      onClick={startEditing}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit name"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </>
                )}
                {/* Pro badge */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                  <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                  PRO
                </span>
                {user.isAdmin && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                    Admin
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-gray-500 text-sm mt-1">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>

              {/* Member since */}
              <p className="text-xs text-gray-400 mt-1">Member since February 2026</p>

              {/* Star rating summary */}
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                <StarRating rating={Math.round(avgRating)} size="w-4 h-4" />
                <span className="text-sm font-semibold text-gray-700">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-sm text-slate-400 font-bold ml-1">
                  ({approvedCount} listings)
                </span>
                {user.isAdmin && (
                  <div className="flex items-center gap-1.5 text-apple-blue font-black ml-4 bg-apple-blue/5 px-3 py-1 rounded-full">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest">Administrator</span>
                  </div>
                )}
              </div>

              {!isEditing && (
                <button
                  onClick={startEditing}
                  className="mt-6 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-apple-blue transition-colors px-4 py-2 bg-slate-50 hover:bg-apple-blue/5 rounded-2xl active:scale-95"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-10 border-t border-slate-100">
            {[
              { label: 'Active Ads', count: approvedCount, icon: CheckCircle, color: 'text-emerald-500' },
              { label: 'Avg Rating', count: avgRating.toFixed(1), icon: Star, color: 'text-amber-400' },
              { label: 'Messages', count: '12', icon: Mail, color: 'text-apple-blue' },
              { label: 'Total Views', count: '1.2k', icon: Eye, color: 'text-slate-400' },
            ].map((stat, i) => (
              <div key={i} className="text-center sm:text-left space-y-1 px-4">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                </div>
                <p className="text-2xl font-black text-slate-900">{stat.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Navigation Tabs (Simulated)                                        */}
        {/* ------------------------------------------------------------------ */}
        <div className="flex items-center gap-2 p-1.5 bg-white/50 backdrop-blur-md rounded-4xl border border-slate-100 shadow-sm overflow-x-auto">
          {[
            { label: 'My Listings', to: '/my-ads', active: true },
            { label: 'Messages',   to: '/messages' },
            { label: 'Saved',      to: '#' },
            { label: 'Settings',   to: '/settings' },
          ].map((tab) => (
            <Link
              key={tab.label}
              to={tab.to}
              className={`px-6 py-3 rounded-3xl text-sm font-bold transition-all whitespace-nowrap active:scale-95 ${
                tab.active 
                  ? 'bg-apple-blue text-white shadow-md shadow-apple-blue/20' 
                  : 'text-slate-600 hover:bg-white'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Listings Preview                                                   */}
        {/* ------------------------------------------------------------------ */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight px-2">Recent Listings</h2>
            <Link to="/my-ads" className="text-sm font-bold text-apple-blue hover:underline px-2">Manage All</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myAds.length > 0 ? (
              myAds.slice(0, 4).map((ad) => (
                <div key={ad.id} className="apple-card p-4 flex gap-4 items-center">
                  <img src={ad.image} alt={ad.title} className="w-20 h-20 rounded-2xl object-cover shrink-0" onError={handleImgError} />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-slate-900 truncate mb-1">{ad.title}</h4>
                    <p className="text-xs font-black text-apple-blue mb-2">{ad.price.toLocaleString()} {ad.currency}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-full ${
                        ad.approvalStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {ad.approvalStatus}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </div>
              ))
            ) : (
              <div className="col-span-full apple-card p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-8 h-8 text-slate-300" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">No listings yet</p>
                  <p className="text-sm text-slate-400 mt-1">Start selling by posting your first ad.</p>
                </div>
                <button onClick={onPostAdClick} className="apple-button px-8 py-3 bg-apple-blue text-white font-bold shadow-lg shadow-apple-blue/20">
                  Post Your First Ad
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Reviews                                                              */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
              <p className="text-sm text-gray-500 mt-0.5">What buyers say about you</p>
            </div>
            {/* Average pill */}
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-amber-700">{avgRating.toFixed(1)}</span>
              <span className="text-xs text-amber-600">/ 5</span>
            </div>
          </div>

          {userReviews.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No reviews yet.</p>
          ) : (
            <div className="space-y-5">
              {userReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <img
                    src={review.reviewerAvatar}
                    alt={review.reviewerName}
                    className="w-10 h-10 rounded-full shrink-0 object-cover"
                    onError={handleImgError}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <span className="font-semibold text-gray-800 text-sm">
                          {review.reviewerName}
                        </span>
                        <span className="ml-2 text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
                          {review.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} size="w-3.5 h-3.5" />
                        <span className="text-xs text-gray-400">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Settings shortcut                                                    */}
        {/* ------------------------------------------------------------------ */}
        <Link
          to="/settings"
          className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:border-blue-200 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Account Settings</p>
              <p className="text-xs text-gray-400 mt-0.5">Notifications, privacy, security, language &amp; more</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors" />
        </Link>

      </div>
      <FloatingActionBar
        onHome={() => navigate('/')}
        onPostAd={onPostAdClick}
        onProfile={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    </div>
  );
};

export default ProfilePage;
