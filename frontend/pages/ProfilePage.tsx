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
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
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
        />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
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

  const saveEditing = () => {
    const trimmed = draftName.trim();
    if (!trimmed) return;
    onUpdateUser({ name: trimmed });
    setIsEditing(false);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
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

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* ------------------------------------------------------------------ */}
        {/* Profile Header                                                       */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0 group">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-50"
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
                <span className="text-sm text-gray-400">
                  ({userReviews.length} review{userReviews.length !== 1 ? 's' : ''})
                </span>
              </div>
            </div>

            {/* Edit Profile button (visible on sm+) */}
            {!isEditing && (
              <button
                onClick={startEditing}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Stats                                                                */}
        {/* ------------------------------------------------------------------ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Listings', value: myAds.length, color: 'text-blue-600', bg: 'bg-blue-50', icon: <UserIcon className="w-5 h-5" /> },
            { label: 'Approved', value: approvedCount, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <CheckCircle className="w-5 h-5" /> },
            { label: 'Pending', value: pendingCount, color: 'text-amber-600', bg: 'bg-amber-50', icon: <Eye className="w-5 h-5" /> },
            { label: 'Rejected', value: rejectedCount, color: 'text-red-600', bg: 'bg-red-50', icon: <X className="w-5 h-5" /> }
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col items-center text-center gap-2"
            >
              <div className={`${stat.bg} ${stat.color} p-2 rounded-xl`}>{stat.icon}</div>
              <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
              <span className="text-xs font-medium text-gray-500">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Reviews                                                              */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
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
    </div>
  );
};

export default ProfilePage;
