import { MessageSquare, Send, ShieldAlert, Loader2, AlertTriangle } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { AdMessage } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { messagesAPI } from '../services/api';

const MessagesPage: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const [messages, setMessages] = useState<Record<string, AdMessage[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchMessages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedMessages = await messagesAPI.getAll();
        setMessages(fetchedMessages);
      } catch (err: any) {
        setError(err.message || 'Failed to load messages.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [user]);


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
          <button onClick={openAuthModal} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const threads = useMemo(() => {
    return Object.entries(messages)
      .map(([adId, adMessages]) => ({
        ad: adMessages[0]?.adId, // Assuming adId object is populated
        messages: adMessages.slice().sort((a, b) => a.id.localeCompare(b.id)),
      }))
      .filter(thread => thread.ad && thread.messages.length > 0)
      .sort((a, b) => {
        const aLast = a.messages[a.messages.length - 1]?.id ?? '';
        const bLast = b.messages[b.messages.length - 1]?.id ?? '';
        return bLast.localeCompare(aLast);
      });
  }, [messages]);

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

        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
            <p className="mt-2 text-gray-500">Loading conversations...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-red-800">Could not load messages</h2>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        ) : threads.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
            <MessageSquare className="w-10 h-10 text-blue-500 mx-auto mb-3" />
            <p className="text-lg font-semibold text-gray-900">No conversations yet</p>
            <p className="text-sm text-gray-500 mt-1">Messages from buyers will appear here when they contact you.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {threads.map(({ ad, messages }) => (
              <div key={thread.ad._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-4">
                  <img src={thread.ad.image} alt={thread.ad.title} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-bold text-gray-800">{thread.ad.title}</h3>
                    <p className="text-sm text-gray-500">{thread.messages.length} messages</p>
                  </div>
                </div>
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                  {thread.messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.senderRole === 'owner' ? 'justify-end' : ''}`}>
                      {msg.senderRole !== 'owner' && (
                        <img src={msg.senderId.avatar} alt={msg.senderName} className="w-8 h-8 rounded-full" />
                      )}
                      <div className={`max-w-md p-3 rounded-xl ${
                        msg.senderRole === 'owner'
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                      {msg.senderRole === 'owner' && (
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type your reply..."
                      className="w-full pl-4 pr-12 py-2 rounded-full bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      value={replyDrafts[thread.ad._id] || ''}
                      onChange={(e) => setReplyDrafts(prev => ({ ...prev, [thread.ad._id]: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleReplySubmit(thread.ad._id)}
                    />
                    <button
                      onClick={() => handleReplySubmit(thread.ad._id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition"
                    >
                      <Send className="w-4 h-4" />
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

export default MessagesPage;
