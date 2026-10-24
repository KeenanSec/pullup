export type Category = 'study' | 'sports' | 'food' | 'hangout';

export type MeetupStatus = 'pending' | 'confirmed' | 'dissolved';

export interface User {
  id: string;
  name: string;
  avatar: string;
  campus: string;
  tokens: number;
  maxTokens: number;
  reliability: number;
}

export interface LockedUser {
  id: string;
  name: string;
  avatar: string;
  lockedAt: string;
}

export interface Meetup {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  category: Category;
  locationName: string;
  locationDetails?: string;
  thresholdCount: number;
  maxCount?: number;
  currentCount: number;
  expiresAt: string; // ISO string
  status: MeetupStatus;
  isUserLockedIn: boolean;
  lockedUsers: LockedUser[];
  perk?: string; // e.g. "Free Celsius on arrival" or "10% off drinks"
}
