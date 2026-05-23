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
      description: 'Perfect for casual browsing and basic listings.',
      priceMonthly: 0,
      priceYearly: 0,
      features: [
        { text: 'Standard support', available: true },
        { text: 'Up to 3 active vehicle/home listings', available: true },
        { text: 'Basic search visibility', available: true },
        { text: 'Featured banner badge', available: false },
        { text: 'Direct client chat bumps', available: false },
      ],
      buttonText: 'Get Started',
      featured: false,
    },
    {
      name: 'Pro',
      description: 'Ideal for frequent users looking to maximize visibility.',
      priceMonthly: 1500, // E.g., Local currency structure DA or USD equivalent
      priceYearly: 1200, 
      features: [
        { text: 'Priority support', available: true },
        { text: 'Up to 20 active multi-service listings', available: true },
        { text: 'Enhanced search positioning', available: true },
        { text: 'Social media cross-posting', available: true },
        { text: 'Advanced performance analytics', available: false },
      ],
      buttonText: 'Upgrade to Pro',
      featured: false,
    },
    {
      name: 'Premium',
      description: 'The ultimate tool kit for agencies, power sellers, and business brokers.',
      priceMonthly: 3500,
      priceYearly: 2800,
      features: [
        { text: '24/7 dedicated account assistance', available: true },
        { text: 'Unlimited active listings across all markets', available: true },
        { text: 'Top-tier automated search boosting', available: true },
        { text: 'Verified partner verification profile badge', available: true },
        { text: 'Full analytics suite + automated lead tracking', available: true },
      ],
      buttonText: 'Go Premium',
      featured: true, // Inverts colors for high contrast spotlighting
    },
  ];

  return (
    <div className="min-h-screen bg-brand-surface flex flex-col font-sans">
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
            <p className="sub-subtitle">Choose the perfect plan to boost your listings and reach your goals.</p>
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
              Yearly (Save ~20%)
            </button>
          </div>

          <div className="plans-grid">
            {plans.map((plan, index) => {
              const currentPrice = isYearly ? plan.priceYearly : plan.priceMonthly;
              return (
                <div key={index} className={`plan-card ${plan.featured ? 'featured' : ''}`}>
                  {plan.featured && <span className="badge">Most Popular</span>}
                  
                  <div>
                    <h2 className="plan-name">{plan.name}</h2>
                    <p className="plan-description">{plan.description}</p>
                    
                    <div className="plan-price-container">
                      <span className="plan-price">
                        {currentPrice === 0 ? 'Free' : `${currentPrice} DA`}
                      </span>
                      {currentPrice > 0 && (
                        <span className="plan-duration">/{isYearly ? 'mo (billed annually)' : 'mo'}</span>
                      )}
                    </div>

                    <ul className="features-list">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className={`feature-item ${!feature.available ? 'disabled' : ''}`}>
                          <span className="feature-icon">{feature.available ? '✓' : '✕'}</span>
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
