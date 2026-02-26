import { CheckCircle2, Clock3, ShieldAlert, XCircle } from 'lucide-react';
import React from 'react';
import Navbar from '../components/Navbar';
import { handleImgError } from '../constants';
import { Ad, User } from '../types';

interface AdminPageProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onPostAdClick: () => void;
  ads: Ad[];
  onApproveAd: (adId: string) => void;
  onRejectAd: (adId: string) => void;
  selectedWilaya: string;
  onWilayaChange: (wilaya: string) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({
  user,
  onSignIn,
  onSignOut,
  onPostAdClick,
  ads,
  onApproveAd,
  onRejectAd,
  selectedWilaya,
  onWilayaChange,
}) => {
  const pendingAds = ads.filter((ad) => ad.approvalStatus === 'pending');

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          user={user}
          onSignIn={onSignIn}
          onSignOut={onSignOut}
          onPostAd={onPostAdClick}
          selectedWilaya={selectedWilaya}
          onWilayaChange={onWilayaChange}
        />

        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-600 mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Access Required</h1>
          <p className="text-gray-500 mt-2">Only admin accounts can approve or reject posted ads.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={user}
        onSignIn={onSignIn}
        onSignOut={onSignOut}
        onPostAd={onPostAdClick}
        selectedWilaya={selectedWilaya}
        onWilayaChange={onWilayaChange}
      />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Moderation</h1>
          <p className="text-gray-500 mt-2">Approve or reject each new ad before it appears to users.</p>
        </div>

        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold">
          <Clock3 className="w-4 h-4" />
          Pending ads: {pendingAds.length}
        </div>

        {pendingAds.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <p className="text-lg font-semibold text-gray-900">No pending ads</p>
            <p className="text-sm text-gray-500 mt-1">All submitted ads have already been reviewed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pendingAds.map((ad) => (
              <div key={ad.id} className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                <div className="h-44 bg-gray-100">
                  <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" loading="lazy" decoding="async" onError={handleImgError} />
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">{ad.category}</p>
                  <h3 className="text-base font-bold text-gray-900 mt-1 line-clamp-2">{ad.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{ad.location}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{ad.price.toLocaleString()} {ad.currency}</p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onApproveAd(ad.id)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-sm font-semibold transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => onRejectAd(ad.id)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white px-3 py-2 text-sm font-semibold transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
