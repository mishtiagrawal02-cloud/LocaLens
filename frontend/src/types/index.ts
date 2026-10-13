export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'traveler' | 'expert';
}

export interface LocalExpert {
  id: string;
  name: string;
  rating: number;
  hourlyRate: number;
  isOnline: boolean;
  languages: string[];
  lat?: number;
  lng?: number;
  specialties?: string[];
  accessibilityExpertise?: AccessibilityTag[];
}

export interface IncomingRequest {
  id: string;
  travelerName: string;
  travelerTag: string;
  requestText: string;
  estimatedEarnings: number;
  status: 'pending' | 'active';
}

export interface MapLocation {
  lat: number;
  lng: number;
  name: string;
}

export interface HotelPass {
  code: string;
  hotelName: string;
  minutesGranted: number;
  expiresAt: Date;
  isRedeemed: boolean;
}

export interface SessionCost {
  totalMinutes: number;
  ratePerMinute: number;
  totalCost: number;
  guideShare: number;
  platformFee: number;
}

export type AccessibilityTag = 
  | 'wheelchair-accessible' 
  | 'step-free' 
  | 'low-sensory' 
  | 'audio-description';

export interface AccessibilityFilter {
  wheelchairAccessible: boolean;
  stepFree: boolean;
  lowSensory: boolean;
  audioDescription: boolean;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface SessionReview {
  rating: number;
  feedbackTags: string[];
  comment?: string;
  tipAmount: number;
  saveToFavorites: boolean;
}

export interface RouteDestination {
  id: string;
  name: string;
  lat: number;
  lng: number;
  note?: string;
  category?: string;
}

export interface PushedRoute {
  id: string;
  destination: RouteDestination;
  distance: number; // in meters
  duration: number; // in minutes
  pushedAt: Date;
  expertName: string;
  googleMapsUrl: string;
  audioPrompt?: string;
}

export interface TravelerLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: Date;
}
