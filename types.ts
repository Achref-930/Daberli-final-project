export type Category = 'auto' | 'real-estate' | 'jobs' | 'services';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
}

export interface Ad {
  id: string;
  title: string;
  category: Category;
  price: number;
  currency: string;
  location: string; // Wilaya
  image: string;
  images?: string[];   // all uploaded photos; images[0] === image (cover)
  isVerified: boolean;
  isBoosted?: boolean; // Admin-selected promoted ads
  rating?: number; // For Pros
  approvalStatus?: ApprovalStatus;
  postedByUserId?: string;
  datePosted: string;
  details?: {
    [key: string]: string | number; // Dynamic details based on category (e.g., Mileage, Sq meters)
  };
}

export interface AdMessage {
  id: string;
  adId: string;
  senderName: string;
  senderRole: 'buyer' | 'owner';
  text: string;
  timestamp: string;
}

export interface Wilaya {
  code: string;
  name: string;
  ar_name?: string;
}
