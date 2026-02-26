import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AuthModal from './components/AuthModal';
import PostAdModal from './components/PostAdModal';
import { authAPI, adsAPI, messagesAPI } from './services/api';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import AdDetailPage from './pages/AdDetailPage';
import AutoPage from './pages/AutoPage';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import JobsPage from './pages/JobsPage';
import MessagesPage from './pages/MessagesPage';
import MyAdsPage from './pages/MyAdsPage';
import ProfilePage from './pages/ProfilePage';
import RealEstatePage from './pages/RealEstatePage';
import ServicesPage from './pages/ServicesPage';
import { Ad, AdMessage, Category, User } from './types';

// New component to handle scrolling
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  
  // Data State
  const [ads, setAds] = useState<Ad[]>([]);
  const [adMessages, setAdMessages] = useState<Record<string, AdMessage[]>>({});

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPostAdModalOpen, setIsPostAdModalOpen] = useState(false);

  // ─── Load user from token on mount ──────────────────────────────────────
  useEffect(() => {
    if (authAPI.isLoggedIn()) {
      authAPI.getMe()
        .then((data) => setUser(data.user))
        .catch(() => {
          authAPI.logout();
        });
    }
  }, []);

  // ─── Fetch ads from backend ─────────────────────────────────────────────
  const fetchAds = async () => {
    try {
      const data = await adsAPI.getAll({ userId: user?.id });
      setAds(data);
    } catch (error) {
      console.error('Failed to fetch ads:', error);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [user]);

  // Auth Handlers
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const handleSignIn = async (email: string, password: string, name?: string, mode?: 'login' | 'register') => {
    try {
      let data;
      if (mode === 'register' && name) {
        data = await authAPI.register(name, email, password);
      } else {
        data = await authAPI.login(email, password);
      }
      setUser(data.user);
    } catch (error: any) {
      throw error; // Let the AuthModal handle the error display
    }
  };

  const handleSignOut = () => {
    authAPI.logout();
    setUser(null);
  };

  const handleUpdateUser = async (updates: Partial<User>) => {
    try {
      // If only avatar is being updated, it was already saved by the upload endpoint
      // Just update local state
      if (updates.avatar && Object.keys(updates).length === 1) {
        setUser((prev) => prev ? { ...prev, ...updates } : prev);
        return;
      }
      const data = await authAPI.updateProfile(updates);
      setUser(data.user);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  // Post Ad Logic
  const handlePostAdClick = () => {
    if (!user) {
      openAuthModal();
    } else {
      setIsPostAdModalOpen(true);
    }
  };

  const handlePostAdSubmit = async (adData: any, imageFiles?: File[]) => {
    if (!user) return;

    try {
      const newAd = await adsAPI.create(adData, imageFiles);
      setAds((prevAds) => [newAd, ...prevAds]);
    } catch (error) {
      console.error('Failed to post ad:', error);
    }
  };

  const handleSendReply = async (adId: string, text: string) => {
    if (!user) return;

    try {
      const message = await messagesAPI.send(adId, text, 'owner');

      const adaptedMessage: AdMessage = {
        id: message._id,
        adId: message.adId,
        senderName: message.senderName,
        senderRole: message.senderRole,
        text: message.text,
        timestamp: 'Just now',
      };

      setAdMessages((prev) => ({
        ...prev,
        [adId]: [...(prev[adId] ?? []), adaptedMessage],
      }));
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleApproveAd = async (adId: string) => {
    try {
      await adsAPI.approve(adId);
      setAds((prevAds) =>
        prevAds.map((ad) =>
          ad.id === adId || ad._id === adId ? { ...ad, approvalStatus: 'approved' } : ad
        )
      );
    } catch (error) {
      console.error('Failed to approve ad:', error);
    }
  };

  const handleRejectAd = async (adId: string) => {
    try {
      await adsAPI.reject(adId);
      setAds((prevAds) =>
        prevAds.map((ad) =>
          ad.id === adId || ad._id === adId ? { ...ad, approvalStatus: 'rejected' } : ad
        )
      );
    } catch (error) {
      console.error('Failed to reject ad:', error);
    }
  };

  const visibleAds = ads.filter((ad) => {
    if (ad.approvalStatus === 'approved') return true;
    if (!user) return false;

    const adOwner = (ad as any).postedByUserId?._id || (ad as any).postedByUserId;
    return adOwner === user.id;
  });

  const handleSearch = (query: string, category: Category | 'all') => {
    const q = query.trim();
    if (category !== 'all') {
      navigate(`/${category}${q ? `?q=${encodeURIComponent(q)}` : ''}`);
    } else if (q) {
      navigate(`/?q=${encodeURIComponent(q)}`);
    } else {
      const el = document.getElementById('featured-listings');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sharedProps = {
    user,
    ads: visibleAds,
    onSignIn: openAuthModal,
    onSignOut: handleSignOut,
    onPostAdClick: handlePostAdClick,
    onPostAdSubmit: handlePostAdSubmit
  };

  return (
    <>
        <Routes>
            <Route path="/" element={
                <HomePage 
                    selectedWilaya={selectedWilaya}
                    onWilayaChange={setSelectedWilaya}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    onSearch={handleSearch}
                    onPostAd={handlePostAdClick}
                    {...sharedProps}
                />
            } />
            
            <Route path="/auto" element={
                <AutoPage {...sharedProps} selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} />
            } />

            <Route path="/real-estate" element={
                <RealEstatePage {...sharedProps} selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} />
            } />

            <Route path="/jobs" element={
                <JobsPage {...sharedProps} selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} />
            } />

            <Route path="/services" element={
                <ServicesPage {...sharedProps} selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} />
            } />

            <Route path="/ad/:id" element={
                <AdDetailPage
                    user={user}
                    ads={ads}
                    onSignIn={openAuthModal}
                    onSignOut={handleSignOut}
                    onPostAdClick={handlePostAdClick}
                    selectedWilaya={selectedWilaya}
                    onWilayaChange={setSelectedWilaya}
                    onSendMessage={handleSendReply}
                />
            } />

            <Route path="/admin" element={
              <AdminPage
                user={user}
                onSignIn={openAuthModal}
                onSignOut={handleSignOut}
                onPostAdClick={handlePostAdClick}
                ads={ads}
                onApproveAd={handleApproveAd}
                onRejectAd={handleRejectAd}
                selectedWilaya={selectedWilaya}
                onWilayaChange={setSelectedWilaya}
              />
            } />

            <Route path="/my-ads" element={
              <MyAdsPage
                user={user}
                onSignIn={openAuthModal}
                onSignOut={handleSignOut}
                onPostAdClick={handlePostAdClick}
                ads={ads}
                adMessages={adMessages}
                onSendReply={handleSendReply}
                selectedWilaya={selectedWilaya}
                onWilayaChange={setSelectedWilaya}
              />
            } />

            <Route path="/messages" element={
              <MessagesPage
                user={user}
                onSignIn={openAuthModal}
                onSignOut={handleSignOut}
                onPostAdClick={handlePostAdClick}
                ads={ads}
                adMessages={adMessages}
                onSendReply={handleSendReply}
                selectedWilaya={selectedWilaya}
                onWilayaChange={setSelectedWilaya}
              />
            } />

            <Route path="/profile" element={
              <ProfilePage
                user={user}
                onSignIn={openAuthModal}
                onSignOut={handleSignOut}
                onPostAdClick={handlePostAdClick}
                ads={ads}
                onUpdateUser={handleUpdateUser}
                selectedWilaya={selectedWilaya}
                onWilayaChange={setSelectedWilaya}
              />
            } />

            <Route path="/settings" element={
              <SettingsPage
                user={user}
                onSignIn={openAuthModal}
                onSignOut={handleSignOut}
                onPostAdClick={handlePostAdClick}
                onUpdateUser={handleUpdateUser}
                selectedWilaya={selectedWilaya}
                onWilayaChange={setSelectedWilaya}
              />
            } />

            <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={closeAuthModal} 
            onSignIn={handleSignIn} 
        />

        <PostAdModal
            isOpen={isPostAdModalOpen}
            onClose={() => setIsPostAdModalOpen(false)}
            onSubmit={handlePostAdSubmit}
        />
    </>
  );
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <ScrollToTop /> {/* Needs to be inside BrowserRouter */}
            <AppContent />
        </BrowserRouter>
    );
};

export default App;
