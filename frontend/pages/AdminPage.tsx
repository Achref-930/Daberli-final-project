import { CheckCircle2, Clock3, ShieldAlert, XCircle } from 'lucide-react';
import React from 'react';
import Navbar from '../components/Navbar';
import { handleImgError } from '../constants';
import { Ad, User } from '../types';
import { useNavigate } from 'react-router-dom';
import FloatingActionBar from '../components/FloatingActionBar';

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
  const navigate = useNavigate();
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
          forceScrolled
        />

        <div className="max-w-3xl mx-auto px-4 pt-28 pb-16 md:pt-32 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-600 mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Access Required</h1>
          <p className="text-gray-500 mt-2">Only admin accounts can approve or reject posted ads.</p>
        </div>

        <FloatingActionBar
          onHome={() => navigate('/')}
          onPostAd={onPostAdClick}
          onProfile={() => navigate('/profile')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      <Navbar
        user={user}
        onSignIn={onSignIn}
        onSignOut={onSignOut}
        onPostAd={onPostAdClick}
        selectedWilaya={selectedWilaya}
        onWilayaChange={onWilayaChange}
        forceScrolled
      />

      <div className="max-w-6xl mx-auto px-4 pt-28 pb-10 md:pt-32">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Moderation</h1>
          <p className="text-slate-500 mt-2 font-medium">Approve or reject each new ad before it appears to users.</p>
        </div>

        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400 text-amber-950 text-xs font-black uppercase tracking-tighter shadow-sm">
          <Clock3 className="w-4 h-4" />
          Pending ads: {pendingAds.length}
        </div>

        {pendingAds.length === 0 ? (
          <div className="apple-card px-6 py-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-xl font-black text-slate-900">Queue is Clear</p>
            <p className="text-sm text-slate-400 mt-1 font-medium">All submitted ads have been reviewed. Good job!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pendingAds.map((ad) => (
              <div key={ad.id} className="apple-card overflow-hidden">
                <div className="h-52 bg-slate-100">
                  <img src={ad.image} alt={ad.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" decoding="async" onError={handleImgError} />
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{ad.category}</p>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 line-clamp-2 leading-tight">{ad.title}</h3>
                  <p className="text-sm text-slate-500 mt-2 font-medium">{ad.location}</p>
                  <p className="text-lg font-black text-apple-blue mt-2">{ad.price.toLocaleString()} {ad.currency}</p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => onApproveAd(ad.id)}
                      className="apple-button inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 text-xs font-black uppercase tracking-tighter transition-all shadow-md shadow-emerald-200"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => onRejectAd(ad.id)}
                      className="apple-button inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 text-xs font-black uppercase tracking-tighter transition-all shadow-md shadow-red-200"
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

      <FloatingActionBar
        onHome={() => navigate('/')}
        onPostAd={onPostAdClick}
        onProfile={() => navigate('/profile')}
      />
    </div>
  );
};

export default AdminPage;
