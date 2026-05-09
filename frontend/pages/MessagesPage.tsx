import { MessageSquare, Send, ShieldAlert, Loader2, AlertTriangle, ChevronRight, Search, Plus } from 'lucide-react';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FloatingActionBar from '../components/FloatingActionBar';
import { Ad, AdMessage, User } from '../types';
import { handleImgError } from '../constants';

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
  const navigate = useNavigate();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Group messages into threads by Ad
  const threads = useMemo(() => {
    return Object.entries(adMessages)
      .map(([adId, messages]) => {
        const ad = ads.find(a => a.id === adId || a._id === adId);
        return {
          adId,
          ad,
          messages: messages.slice().sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
          lastMessage: messages[messages.length - 1],
        };
      })
      .filter(t => t.ad)
      .sort((a, b) => {
        const aTime = new Date(a.lastMessage?.timestamp || 0).getTime();
        const bTime = new Date(b.lastMessage?.timestamp || 0).getTime();
        return bTime - aTime;
      });
  }, [adMessages, ads]);

  // Select first thread by default on desktop if none selected
  useEffect(() => {
    if (threads.length > 0 && !selectedThreadId && window.innerWidth >= 768) {
      setSelectedThreadId(threads[0].adId);
    }
  }, [threads, selectedThreadId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedThreadId, adMessages]);

  const activeThread = threads.find(t => t.adId === selectedThreadId);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedThreadId || !replyDraft.trim()) return;
    onSendReply(selectedThreadId, replyDraft.trim());
    setReplyDraft('');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar user={user} onSignIn={onSignIn} onSignOut={onSignOut} onPostAd={onPostAdClick} selectedWilaya={selectedWilaya} onWilayaChange={onWilayaChange} showBackButton forceScrolled />
        <div className="flex-1 flex flex-col items-center justify-center p-6 pt-24 text-center">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 animate-fade-up">
            <ShieldAlert className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Sign in Required</h1>
          <p className="text-slate-500 max-w-xs mb-8">You need to be logged in to view your messages and reply to buyers.</p>
          <button onClick={onSignIn} className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
            Sign In Now
          </button>
        </div>
        <FloatingActionBar onHome={() => navigate('/')} onPostAd={onPostAdClick} onProfile={() => navigate('/profile')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-hidden pt-20 md:pt-24">
      <Navbar user={user} onSignIn={onSignIn} onSignOut={onSignOut} onPostAd={onPostAdClick} selectedWilaya={selectedWilaya} onWilayaChange={onWilayaChange} forceScrolled />

      <main className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full md:p-6 md:pb-24">
        <div className="flex-1 bg-white md:rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden flex">
          
          {/* ── Thread List (Sidebar) ── */}
          <div className={`w-full md:w-80 lg:w-96 border-r border-slate-100 flex flex-col bg-slate-50/30 ${selectedThreadId && 'hidden md:flex'}`}>
            <div className="p-6 pb-2">
              <h1 className="text-3xl font-heading font-extrabold text-slate-900 mb-4">Messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search conversations..." 
                  className="w-full bg-slate-100/80 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 placeholder-slate-400 transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
              {threads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                    <MessageSquare className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">Inbox is empty</p>
                  <p className="text-xs text-slate-400 mt-1">New inquiries will appear here.</p>
                </div>
              ) : (
                threads.map((thread) => (
                  <button
                    key={thread.adId}
                    onClick={() => setSelectedThreadId(thread.adId)}
                    className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 transition-all duration-200 ${
                      selectedThreadId === thread.adId 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                        : 'hover:bg-white hover:shadow-sm text-slate-600'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img 
                        src={thread.ad?.image} 
                        alt="" 
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200/50" 
                        onError={handleImgError}
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-emerald-500 shadow-sm`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className={`font-bold text-sm truncate ${selectedThreadId === thread.adId ? 'text-white' : 'text-slate-900'}`}>
                          {thread.ad?.title}
                        </h3>
                        <span className={`text-[10px] whitespace-nowrap ml-2 ${selectedThreadId === thread.adId ? 'text-blue-100' : 'text-slate-400'}`}>
                          {new Date(thread.lastMessage?.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${selectedThreadId === thread.adId ? 'text-blue-50/80' : 'text-slate-500'}`}>
                        {thread.lastMessage?.text}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 opacity-40 ${selectedThreadId === thread.adId ? 'hidden' : 'block'}`} />
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ── Active Conversation (Main) ── */}
          <div className={`flex-1 flex flex-col bg-white ${!selectedThreadId && 'hidden md:flex'}`}>
            {activeThread ? (
              <>
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedThreadId(null)}
                      className="md:hidden p-2 -ml-2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6 rotate-180" />
                    </button>
                    <img 
                      src={activeThread.ad?.image} 
                      alt="" 
                      className="w-10 h-10 rounded-lg object-cover md:hidden" 
                    />
                    <div>
                      <h2 className="font-bold text-slate-900 leading-tight truncate max-w-45 sm:max-w-xs lg:max-w-md">
                        {activeThread.ad?.title}
                      </h2>
                      <p className="text-[11px] text-emerald-500 font-bold uppercase tracking-wider">
                        {activeThread.messages.length} Messages
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/ad/${activeThread.adId}`)}
                    className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    View Listing
                  </button>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                  {activeThread.messages.map((msg, idx) => {
                    const isMe = msg.senderRole === 'owner';
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        <div className={`max-w-[85%] sm:max-w-[70%] group`}>
                          <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm leading-relaxed ${
                            isMe 
                              ? 'bg-blue-600 text-white rounded-br-sm' 
                              : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm'
                          }`}>
                            {msg.text}
                          </div>
                          <p className={`text-[10px] mt-1 px-1 font-medium ${isMe ? 'text-right text-slate-400' : 'text-slate-400'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 pb-6 border-t border-slate-50 bg-white">
                  <form onSubmit={handleSend} className="flex items-center gap-2 max-w-4xl mx-auto">
                    <button type="button" className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                      <Plus className="w-6 h-6" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={replyDraft}
                        onChange={(e) => setReplyDraft(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-slate-100 border-none rounded-2xl py-3 px-5 text-sm focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                      <button
                        type="submit"
                        disabled={!replyDraft.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:grayscale transition-all active:scale-90"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-50/10">
                <div className="w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center mb-4">
                  <MessageSquare className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Your Conversations</h3>
                <p className="text-slate-400 text-sm max-w-xs mt-2">Select a thread from the list on the left to start messaging.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <FloatingActionBar onHome={() => navigate('/')} onPostAd={onPostAdClick} onProfile={() => navigate('/profile')} />
    </div>
  );
};

export default MessagesPage;
