import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingActionBar from '../components/FloatingActionBar';
import { User, Ad } from '../types';
import './SubscriptionPlans.css';

interface SubscriptionPlansProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onPostAdClick: () => void;
  ads: Ad[];
  selectedWilaya: string;
  onWilayaChange: (wilaya: string) => void;
}

export default function SubscriptionPlans({
  user,
  onSignIn,
  onSignOut,
  onPostAdClick,
  ads,
  selectedWilaya,
  onWilayaChange,
}: SubscriptionPlansProps) {
  const [isYearly, setIsYearly] = useState(false);
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      tagline: 'Ideal for casual, one-off listings.',
      priceMonthly: 0,
      priceYearly: 0,
      features: [
        { text: 'Unlimited Standard Postings', available: true },
        { text: '7-Day Quick Listing Cycle', available: true },
        { text: 'Essential Photo Preview (1 Photo)', available: true },
        { text: 'Standard Marketplace Search Placement', available: true },
        { text: 'Verified Seller Trust Badge', available: false },
        { text: 'Priority Search Visibility Boosts', available: false },
      ],
      buttonText: 'Start Posting Free',
      featured: false,
    },
    {
      name: 'Pro',
      tagline: 'Designed for active traders & independent professionals.',
      priceMonthly: 1500, 
      priceYearly: 1200,  
      features: [
        { text: 'Unlimited Standard Postings', available: true },
        { text: 'Verified Seller Trust Badge (Builds Trust)', available: true },
        { text: 'Extended 30-Day Listing Lifetime', available: true },
        { text: 'Multi-Angle Showcase (3 Photos per ad)', available: true },
        { text: '1 High-Visibility Boost Credit per month', available: true },
        { text: 'Priority Buyer Inquiries Routing', available: true },
      ],
      buttonText: 'Upgrade to Pro',
      featured: false,
    },
    {
      name: 'Premium',
      tagline: 'The ultimate toolkit for Agencies, Showrooms & Businesses.',
      priceMonthly: 3500, 
      priceYearly: 2800,
      features: [
        { text: 'Unlimited Standard Postings', available: true },
        { text: 'Verified Business Profile Badge', available: true },
        { text: 'Maximum 90-Day Extended Market Presence', available: true },
        { text: 'Full Media Gallery (7 Photos per ad)', available: true },
        { text: '4 Premium Priority Boost Credits per month', available: true },
        { text: 'Top-of-Feed Search Visibility Dominance', available: true },
      ],
      buttonText: 'Go Premium',
      featured: true, 
    },
  ];

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col font-sans">
      <Navbar 
        selectedWilaya={selectedWilaya} 
        onWilayaChange={onWilayaChange} 
        user={user}
        onSignIn={onSignIn}
        onSignOut={onSignOut}
        onPostAd={onPostAdClick}
        ads={ads}
        showBackButton
        forceScrolled
      />

      <main className="grow pt-20 md:pt-24 bg-white">
        <div className="sub-container">
          <div className="sub-header">
            <h1 className="sub-title">Subscription Plans</h1>
            <p className="sub-subtitle">Accelerate your deals. Choose the right tier to maximize your listing exposure.</p>
          </div>

          <div className="toggle-container">
            <button 
              className={`toggle-btn ${!isYearly ? 'active' : ''}`} 
              onClick={() => setIsYearly(false)}
            >
              Monthly
            </button>
            <button 
              className={`toggle-btn ${isYearly ? 'active' : ''}`} 
              onClick={() => setIsYearly(true)}
            >
              Yearly (Save 20%)
            </button>
          </div>

          <div className="plans-grid">
            {plans.map((plan, index) => {
              const currentPrice = isYearly ? plan.priceYearly : plan.priceMonthly;
              return (
                <div key={index} className={`plan-card ${plan.featured ? 'featured' : ''}`}>
                  {plan.featured && <span className="sub-badge">Most Popular</span>}
                  
                  <div>
                    <h2 className="plan-name">{plan.name}</h2>
                    <p className="plan-description">{plan.tagline}</p>
                    
                    <div className="plan-price-container">
                      <span className="plan-price">
                        {currentPrice === 0 ? 'Free' : `${currentPrice} DA`}
                      </span>
                      {currentPrice > 0 && (
                        <span className="plan-duration">/{isYearly ? 'mo' : 'mo'}</span>
                      )}
                    </div>

                    <ul className="features-list">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className={`feature-item ${!feature.available ? 'disabled' : ''}`}>
                          <span className="feature-icon">
                            {feature.available ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            ) : (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            )}
                          </span>
                          {feature.text}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    className="plan-btn"
                    onClick={() => {
                      if (currentPrice > 0 && !user) {
                        onSignIn();
                      }
                    }}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
      <FloatingActionBar 
        onHome={() => navigate('/')}
        onPostAd={onPostAdClick} 
        onProfile={user ? () => navigate('/profile') : onSignIn}
      />
    </div>
  );
}
