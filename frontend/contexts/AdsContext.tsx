import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { Ad } from '../types';
import { adsAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface AdsContextType {
  ads: Ad[];
  visibleAds: Ad[];
  isLoading: boolean;
  error: string | null;
  fetchAds: () => Promise<void>;
  handlePostAdSubmit: (adData: any, imageFiles?: File[]) => Promise<void>;
  handleApproveAd: (adId: string) => Promise<void>;
  handleRejectAd: (adId: string) => Promise<void>;
}

const AdsContext = createContext<AdsContextType | undefined>(undefined);

export const AdsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAds = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adsAPI.getAll({ userId: user?.id });
      setAds(data.ads || []); // Ensure ads is always an array
    } catch (err: any) {
      setError(err.message || 'Failed to fetch ads');
      console.error('Failed to fetch ads:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const handlePostAdSubmit = async (adData: any, imageFiles?: File[]) => {
    if (!user) return;

    try {
      const newAd = await adsAPI.create(adData, imageFiles);
      setAds((prevAds) => [newAd, ...prevAds]);
    } catch (error) {
      console.error('Failed to post ad:', error);
      throw error;
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

  const visibleAds = useMemo(() => {
    return ads.filter((ad) => {
      if (ad.approvalStatus === 'approved') return true;
      if (!user) return false;

      const adOwnerId = typeof ad.postedByUserId === 'object' ? ad.postedByUserId?._id : ad.postedByUserId;
      return adOwnerId === user.id;
    });
  }, [ads, user]);

  const value = {
    ads,
    visibleAds,
    isLoading,
    error,
    fetchAds,
    handlePostAdSubmit,
    handleApproveAd,
    handleRejectAd,
  };

  return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
};

export const useAds = () => {
  const context = useContext(AdsContext);
  if (context === undefined) {
    throw new Error('useAds must be used within an AdsProvider');
  }
  return context;
};
