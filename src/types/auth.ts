import { PayoutRail } from './index';

export type KycTier = 'unverified' | 'tier1_basic' | 'tier2_verified' | 'pro_merchant';

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  salt: string;
  passwordHash: string;
  kycTier: KycTier;
  isTwoFactorEnabled: boolean;
  createdAt: string;
  avatarBg: string;
  defaultPayoutRail: PayoutRail;
  defaultPayoutIdentifier: string;
  stats: {
    totalTrades: number;
    volumeTraded: number;
    successRate: number;
    rating: number;
  };
}

export interface AuthSession {
  token: string;
  userId: string;
  expiresAt: number;
}
