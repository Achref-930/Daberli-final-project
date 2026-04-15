import React, { useState } from 'react';
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
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdsProvider } from './contexts/AdsContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, handleSignIn } = useAuth();
  const [isPostAdModalOpen, setIsPostAdModalOpen] = useState(false);
  const [selectedWilaya, setSelectedWilaya] = useState('');

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} />} />
        <Route path="/auto" element={<AutoPage selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} />} />
        <Route path="/real-estate" element={<RealEstatePage selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} />} />
        <Route path="/jobs" element={<JobsPage selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} />} />
        <Route path="/services" element={<ServicesPage selectedWilaya={selectedWilaya} onWilayaChange={setSelectedWilaya} />} />
        <Route path="/ad/:id" element={<AdDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-ads" element={<MyAdsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/about" element={<AboutPage />} />
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
