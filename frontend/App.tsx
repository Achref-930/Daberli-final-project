import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import AuthModal from './components/AuthModal';
import PostAdModal from './components/PostAdModal';
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
import TermsPage from './pages/TermsPage';
import AboutPage from './pages/AboutPage';
import BoostedPage from './pages/BoostedPage';
import SubscriptionPlans from './pages/SubscriptionPlans';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdsProvider, useAds } from './contexts/AdsContext';
import { messagesAPI } from './services/api';
import { AdMessage } from './types';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const {
    user,
    isAuthModalOpen,
    closeAuthModal,
    openAuthModal,
    handleSignIn,
    handleSignOut,
    handleUpdateUser,
    isPostAdModalOpen,
    openPostAdModal,
    closePostAdModal,
  } = useAuth();
  const {
    ads,
    handlePostAdSubmit,
    handleApproveAd,
    handleRejectAd,
  } = useAds();
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [adMessages, setAdMessages] = useState<Record<string, AdMessage[]>>({});

  const loadMessages = useCallback(async () => {
    if (!user) {
      setAdMessages({});
      return;
    }

    try {
      const data = await messagesAPI.getAll();
      setAdMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }, [user]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSendMessage = useCallback(
    async (adId: string, text: string) => {
      if (!user) {
        openAuthModal();
        return;
      }

      try {
        await messagesAPI.send(adId, text, 'buyer');
        await loadMessages();
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    },
    [user, openAuthModal, loadMessages]
  );

  const handleSendReply = useCallback(
    async (adId: string, text: string) => {
      if (!user) {
        return;
      }

      try {
        await messagesAPI.send(adId, text, 'owner');
        await loadMessages();
      } catch (error) {
        console.error('Failed to send reply:', error);
      }
    },
    [user, loadMessages]
  );

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} />} />
        <Route
          path="/auto"
          element={<AutoPage user={user} onSignIn={openAuthModal} onSignOut={handleSignOut} onPostAdClick={openPostAdModal} ads={ads} selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} />}
        />
        <Route
          path="/real-estate"
          element={<RealEstatePage user={user} onSignIn={openAuthModal} onSignOut={handleSignOut} onPostAdClick={openPostAdModal} ads={ads} selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} />}
        />
        <Route
          path="/jobs"
          element={<JobsPage user={user} onSignIn={openAuthModal} onSignOut={handleSignOut} onPostAdClick={openPostAdModal} ads={ads} selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} />}
        />
        <Route
          path="/services"
          element={<ServicesPage user={user} onSignIn={openAuthModal} onSignOut={handleSignOut} onPostAdClick={openPostAdModal} ads={ads} selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} />}
        />
        <Route
          path="/ad/:id"
          element={<AdDetailPage user={user} ads={ads} onSignIn={openAuthModal} onSignOut={handleSignOut} onPostAdClick={openPostAdModal} selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} onSendMessage={handleSendMessage} />}
        />
        <Route
          path="/profile"
          element={<ProfilePage user={user} onSignIn={openAuthModal} onSignOut={handleSignOut} onPostAdClick={openPostAdModal} ads={ads} onUpdateUser={handleUpdateUser} selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} />}
        />
        <Route
          path="/my-ads"
          element={<MyAdsPage user={user} onSignIn={openAuthModal} onSignOut={handleSignOut} onPostAdClick={openPostAdModal} ads={ads} adMessages={adMessages} onSendReply={handleSendReply} selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} />}
        />
        <Route
          path="/boosted"
          element={<BoostedPage user={user} onSignIn={openAuthModal} onSignOut={handleSignOut} onPostAdClick={openPostAdModal} ads={ads} selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} />}
        />
        <Route
          path="/messages"
          element={<MessagesPage user={user} onSignIn={openAuthModal} onSignOut={handleSignOut} onPostAdClick={openPostAdModal} ads={ads} adMessages={adMessages} onSendReply={handleSendReply} selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} />}
        />
        <Route
          path="/settings"
          element={<SettingsPage user={user} onSignIn={openAuthModal} onSignOut={handleSignOut} onPostAdClick={openPostAdModal} onUpdateUser={handleUpdateUser} selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} />}
        />
        <Route
          path="/admin"
          element={<AdminPage user={user} onSignIn={openAuthModal} onSignOut={handleSignOut} onPostAdClick={openPostAdModal} ads={ads} onApproveAd={handleApproveAd} onRejectAd={handleRejectAd} selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} />}
        />
        <Route
          path="/terms"
          element={<TermsPage user={user} onSignIn={openAuthModal} onSignOut={handleSignOut} onPostAdClick={openPostAdModal} ads={ads} selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} />}
        />
        <Route
          path="/about"
          element={<AboutPage user={user} onSignIn={openAuthModal} onSignOut={handleSignOut} onPostAdClick={openPostAdModal} ads={ads} selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} />}
        />
        <Route
          path="/subscription-plans"
          element={<SubscriptionPlans />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onSignIn={handleSignIn}
      />
      <PostAdModal
        isOpen={isPostAdModalOpen}
        onClose={closePostAdModal}
        onSubmit={handlePostAdSubmit}
      />
    </>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <AdsProvider>
        <AppContent />
      </AdsProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
