import { MessageSquare, Send, ShieldAlert } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { Ad, AdMessage, User } from '../types';

interface MessagesPageProps {
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

const MessagesPage: React.FC<MessagesPageProps> = ({
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
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

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
          <p className="text-gray-500 mt-2">Please sign in to view your inbox.</p>
        </div>
      </div>
    );
  }

  const myAds = useMemo(() => ads.filter((ad) => ad.postedByUserId === user.id), [ads, user.id]);

  const threads = useMemo(() => {
    return myAds
      .map((ad) => ({
        ad,
        messages: (adMessages[ad.id] ?? []).slice().sort((a, b) => a.id.localeCompare(b.id))
      }))
      .filter((thread) => thread.messages.length > 0)
      .sort((a, b) => {
        const aLast = a.messages[a.messages.length - 1]?.id ?? '';
        const bLast = b.messages[b.messages.length - 1]?.id ?? '';
        return bLast.localeCompare(aLast);
      });
  }, [myAds, adMessages]);

  const handleReplySubmit = (adId: string) => {
    const draft = (replyDrafts[adId] ?? '').trim();
    if (!draft) return;

    onSendReply(adId, draft);
    setReplyDrafts((prev) => ({ ...prev, [adId]: '' }));
  };

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

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-500 mt-2">All conversations from your posted ads in one inbox.</p>
        </div>

        {threads.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
            <MessageSquare className="w-10 h-10 text-blue-500 mx-auto mb-3" />
            <p className="text-lg font-semibold text-gray-900">No conversations yet</p>
            <p className="text-sm text-gray-500 mt-1">Messages from buyers will appear here when they contact you.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {threads.map(({ ad, messages }) => (
              <div key={ad.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{ad.title}</h2>
                    <p className="text-sm text-gray-500">{ad.location} • {messages.length} messages</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{ad.price.toLocaleString()} {ad.currency}</p>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`rounded-lg px-3 py-2 text-sm ${msg.senderRole === 'owner' ? 'bg-blue-100 text-blue-900' : 'bg-gray-50 text-gray-800 border border-gray-200'}`}
                    >
                      <p className="font-semibold text-xs mb-0.5">{msg.senderName}</p>
                      <p>{msg.text}</p>
                      <p className="text-[11px] opacity-70 mt-1">{msg.timestamp}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={replyDrafts[ad.id] ?? ''}
                    onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [ad.id]: e.target.value }))}
                    placeholder="Write a reply..."
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-daberli-blue/20 focus:border-daberli-blue text-sm"
                  />
                  <button
                    onClick={() => handleReplySubmit(ad.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-daberli-blue hover:bg-blue-800 text-white text-sm font-semibold transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
