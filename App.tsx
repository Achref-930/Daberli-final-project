import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AuthModal from './components/AuthModal';
import PostAdModal from './components/PostAdModal';
import { MOCK_ADS } from './constants';
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

const ADMIN_EMAILS = ['admin@daberli.dz'];

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
  const [ads, setAds] = useState<Ad[]>(
    MOCK_ADS.map((ad) => ({
      ...ad,
      approvalStatus: ad.approvalStatus ?? 'approved'
    }))
  );
  const [adMessages, setAdMessages] = useState<Record<string, AdMessage[]>>({});

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPostAdModalOpen, setIsPostAdModalOpen] = useState(false);

  // Auth Handlers
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const handleSignIn = (email: string) => {
    const namePart = email.split('@')[0];
    const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());

    setUser({
      id: `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
      name: displayName,
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${displayName}&background=0D8ABC&color=fff&rounded=true&bold=true`,
      isAdmin
    });
  };

  const handleSignOut = () => setUser(null);

  const handleUpdateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      // Regenerate avatar URL when name changes
      if (updates.name && updates.name !== prev.name) {
        updated.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(updates.name)}&background=0D8ABC&color=fff&rounded=true&bold=true`;
      }
      return updated;
    });
  };

  // Post Ad Logic
  const handlePostAdClick = () => {
    if (!user) {
      openAuthModal();
    } else {
      setIsPostAdModalOpen(true);
    }
  };

  const handlePostAdSubmit = (adData: any) => {
    if (!user) return;

    const newAd: Ad = {
      id: Math.random().toString(36).substr(2, 9),
      ...adData,
      isVerified: false,
      approvalStatus: 'approved',
      postedByUserId: user.id,
      datePosted: 'Just now',
    };
    setAds((prevAds) => [newAd, ...prevAds]);

    setAdMessages((prev) => ({
      ...prev,
      [newAd.id]: [
        {
          id: `${newAd.id}-m1`,
          adId: newAd.id,
          senderName: 'Buyer',
          senderRole: 'buyer',
          text: 'Hello, is this still available?',
          timestamp: 'Just now'
        }
      ]
    }));
  };

  const handleSendReply = (adId: string, text: string) => {
    if (!user) return;

    const reply: AdMessage = {
      id: `${adId}-${Date.now()}`,
      adId,
      senderName: user.name,
      senderRole: 'owner',
      text,
      timestamp: 'Just now'
    };

    setAdMessages((prev) => ({
      ...prev,
      [adId]: [...(prev[adId] ?? []), reply]
    }));
  };

  const handleApproveAd = (adId: string) => {
    setAds((prevAds) =>
      prevAds.map((ad) =>
        ad.id === adId ? { ...ad, approvalStatus: 'approved' } : ad
      )
    );
  };

  const handleRejectAd = (adId: string) => {
    setAds((prevAds) =>
      prevAds.map((ad) =>
        ad.id === adId ? { ...ad, approvalStatus: 'rejected' } : ad
      )
    );
  };

  const visibleAds = ads.filter((ad) => {
    if (ad.approvalStatus === 'approved') return true;
    if (!user) return false;

    return ad.postedByUserId === user.id;
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
