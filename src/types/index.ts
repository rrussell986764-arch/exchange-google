export type CardCategory = 'gaming' | 'tech' | 'retail' | 'fashion' | 'prepaid';
export type CurrencyCode = 'USD' | 'GBP' | 'EUR' | 'CAD' | 'AUD';

export interface GiftCardBrand {
  id: string;
  name: string;
  category: CardCategory;
  ratePerDollar: number; // In Naira (NGN) per $1 USD, e.g. 1,650 NGN/$
  ratePerGbp?: number;   // e.g. 2,120 NGN/£
  ratePerEur?: number;   // e.g. 1,780 NGN/€
  pinRequired: boolean;
  pinLength: number;
  cardNumberFormat: string;
  supportedCurrencies: CurrencyCode[];
  popularDenominations: number[];
  cardTypeOptions: ('Physical (Receipt + Card)' | 'E-Code / Digital')[];
  verificationSpeed: string;
  badge?: string;
}

export type OrderStatus = 'pending_verification' | 'redeemed_settling' | 'completed' | 'declined';

export type PayoutRail = 'nigerian_bank' | 'opay_palmpay' | 'usdc_crypto' | 'momo_ghana' | 'mobile_money_kenya';

export interface NigerianBank {
  code: string;
  name: string;
  popular?: boolean;
}

export interface PayoutDestination {
  rail: PayoutRail;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  walletAddress?: string;
  label: string;
  speed: string;
}

export interface GiftCardOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  brandId: string;
  brandName: string;
  currency: CurrencyCode;
  faceValue: number;
  cardType: 'Physical (Receipt + Card)' | 'E-Code / Digital';
  exchangeRateNgn: number; // e.g. 1650 NGN per USD
  payoutAmountNgn: number;  // e.g. 165,000 NGN
  status: OrderStatus;
  userId: string;
  userName: string;
  cardNumberMasked: string;
  cardPinMasked: string;
  fullCardNumber?: string;
  fullCardPin?: string;
  cardImageUrl?: string;
  receiptImageUrl?: string;
  payoutDestination: PayoutDestination;
  settlementTxRef?: string;
  verificationLogs: string[];
}

export interface WalletState {
  availableBalanceNgn: number;
  lifetimeRedeemedNgn: number;
  totalCardsExchanged: number;
  savedBanks: PayoutDestination[];
}

export interface PriceAlert {
  id: string;
  brandId: string;
  brandName: string;
  currency: CurrencyCode;
  baselineRate: number; // rate when alert was created
  targetRate: number;   // rate target in Naira
  condition: 'gte' | 'lte'; // greater than or equal to, or drops below
  notifyPush: boolean;
  notifyEmail: boolean;
  email?: string;
  status: 'active' | 'triggered' | 'paused';
  createdAt: string;
  triggeredAt?: string;
}
