import { MessageSquare, Send, ShieldAlert, Zap, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import { handleImgError } from '../constants';
import { useAds } from '../contexts/AdsContext';
import { Ad, AdMessage, User } from '../types';
import { useNavigate } from 'react-router-dom';
import FloatingActionBar from '../components/FloatingActionBar';

interface MyAdsPageProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onPostAdClick: () => void;
  ads: Ad[];
  adMessages: Record<string, AdMessage[]>;
  onSendReply: (adId: string, text: string) => void;
  selectedWilaya: string;
  onWilayaChange: (wilaya: string) => void;
}

const statusStyles: Record<string, string> = {
  approved: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  rejected: 'bg-red-100 text-red-700'
};

const MyAdsPage: React.FC<MyAdsPageProps> = ({
  user,
  onSignIn,
  onSignOut,
  onPostAdClick,
  ads,
  adMessages,
  onSendReply,
  selectedWilaya,
  onWilayaChange,
}) => {
  const { handleBoostAd, handleUnboostAd, handleDeleteAd } = useAds();
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const messageContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const navigate = useNavigate();

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
          <p className="text-gray-500 mt-2">Please sign in to view and manage your ads.</p>
        </div>

        <FloatingActionBar
          onHome={() => navigate('/')}
          onPostAd={onPostAdClick}
          onProfile={() => navigate('/profile')}
        />
      </div>
    );
  }

  const getOwnerId = (ad: any) => typeof ad.postedByUserId === 'object' && ad.postedByUserId ? ad.postedByUserId._id : ad.postedByUserId;
  const myAds = ads.filter((ad) => getOwnerId(ad) === user.id);

  const handleReplySubmit = (adId: string) => {
    const draft = (replyDrafts[adId] ?? '').trim();
    if (!draft) return;

    onSendReply(adId, draft);
    setReplyDrafts((prev) => ({ ...prev, [adId]: '' }));

    // Auto-scroll message thread to bottom after state update
    setTimeout(() => {
      const el = messageContainerRefs.current[adId];
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  };

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

      <div className="max-w-6xl mx-auto px-4 pt-28 pb-10 md:pt-32">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Ads</h1>
          <p className="text-slate-500 mt-2 font-medium">Review your posts and reply to buyer messages.</p>
        </div>

        {myAds.length === 0 ? (
          <div className="apple-card px-6 py-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-xl font-black text-slate-900">No ads posted yet</p>
            <p className="text-sm text-slate-400 mt-1 font-medium">Post your first ad to start receiving messages.</p>
            <button onClick={onPostAdClick} className="apple-button mt-6 px-8 py-3 bg-apple-blue text-white font-bold shadow-lg shadow-apple-blue/20">
              Post Your First Ad
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {myAds.map((ad) => {
              const messages = adMessages[ad.id] ?? [];
              const status = ad.approvalStatus ?? 'pending';

              return (
                <div key={ad.id} className="apple-card overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
                    <div className="h-64 lg:h-full bg-slate-100">
                      <img src={ad.image} alt={ad.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" onError={handleImgError} />
                    </div>

                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-500 uppercase tracking-widest">{ad.category}</span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusStyles[status] ?? statusStyles.pending}`}>
                          {status}
                        </span>
                        {ad.isBoosted && (
                          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-400 text-amber-950 flex items-center gap-1 uppercase tracking-tighter shadow-sm">
                            <Zap className="w-3 h-3 fill-current" />
                            BOOSTED
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">{ad.title}</h2>
                      <p className="text-sm text-slate-400 mt-1 font-bold uppercase tracking-wider">{ad.location} • {ad.datePosted}</p>
                      <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                        <p className="text-xl font-black text-apple-blue">{ad.price.toLocaleString()} {ad.currency}</p>
                        <div className="flex items-center gap-2.5">
                          {!ad.isBoosted && status === 'approved' && (
                            <button
                              onClick={() => {
                                const adId = ad.id || ad._id;
                                if (!adId) return;
                                handleBoostAd(adId);
                              }}
                              className="apple-button inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 text-xs font-black transition-all shadow-md shadow-amber-200 tracking-tighter"
                            >
                              <Zap className="w-4 h-4 fill-current" />
                              BOOST LISTING
                            </button>
                          )}
                          {ad.isBoosted && status === 'approved' && (
                            <button
                              onClick={() => {
                                const adId = ad.id || ad._id;
                                if (!adId) return;
                                handleUnboostAd(adId);
                              }}
                              className="apple-button inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition-all shadow-sm tracking-tighter"
                            >
                              <Zap className="w-4 h-4" />
                              UNBOOST
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              const adId = ad.id || ad._id;
                              if (!adId) return;
                              if (confirm('Are you sure you want to permanently delete this listing? This action cannot be undone.')) {
                                try {
                                  await handleDeleteAd(adId);
                                } catch (err: any) {
                                  alert(err.message || 'Failed to delete listing.');
                                }
                              }
                            }}
                            className="apple-button inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-black transition-all tracking-tighter"
                            title="Delete listing"
                          >
                            <Trash2 className="w-4 h-4" />
                            DELETE
                          </button>
                        </div>
                      </div>

                      <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Messages thread ({messages.length})</p>

                        <div
                          className="space-y-3 max-h-56 overflow-y-auto pr-2 custom-scrollbar"
                          ref={(el) => { messageContainerRefs.current[ad.id] = el; }}
                        >
                          {messages.length === 0 ? (
                            <p className="text-sm text-slate-400 font-medium italic">No messages yet for this ad.</p>
                          ) : (
                            messages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.senderRole === 'owner' ? 'bg-apple-blue text-white ml-8' : 'bg-white text-slate-800 mr-8 border border-slate-100'}`}
                              >
                                <p className="font-black text-[10px] mb-1 uppercase tracking-wider opacity-60">{msg.senderName}</p>
                                <p className="font-medium leading-relaxed">{msg.text}</p>
                                <p className="text-[10px] font-bold opacity-50 mt-2">{msg.timestamp}</p>
                              </div>
                            ))
                          )}
                        </div>

                        <div className="mt-5 flex gap-3">
                          <input
                            type="text"
                            value={replyDrafts[ad.id] ?? ''}
                            onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [ad.id]: e.target.value }))}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReplySubmit(ad.id); } }}
                            placeholder="Write a message..."
                            className="flex-1 px-4 py-3 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-apple-blue/5 text-sm font-medium border-none shadow-sm"
                          />
                          <button
                            onClick={() => handleReplySubmit(ad.id)}
                            className="apple-button inline-flex items-center justify-center w-12 h-12 bg-apple-blue text-white shadow-lg shadow-apple-blue/20"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      </div>
                    </div>
                  </div>
              );
            })}
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

export default MyAdsPage;
