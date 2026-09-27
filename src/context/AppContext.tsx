import React, { createContext, useContext, useState, useEffect } from 'react';
import { GiftCardOrder, PayoutDestination, WalletState, CurrencyCode, PriceAlert, GiftCardBrand } from '../types';
import { GIFT_CARD_BRANDS, INITIAL_ORDERS, NIGERIAN_BANKS } from '../data/brands';

interface AppContextType {
  brands: GiftCardBrand[];
  orders: GiftCardOrder[];
  wallet: WalletState;
  priceAlerts: PriceAlert[];
  activeOrderId: string | null;
  setActiveOrderId: (id: string | null) => void;
  isSellModalOpen: boolean;
  setIsSellModalOpen: (open: boolean) => void;
  isWalletOpen: boolean;
  setIsWalletOpen: (open: boolean) => void;
  isAlertModalOpen: boolean;
  alertModalBrandId: string | null;
  alertModalCurrency: CurrencyCode;
  openAlertModal: (brandId?: string, currency?: CurrencyCode) => void;
  closeAlertModal: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  
  // Alert Actions
  createPriceAlert: (params: {
    brandId: string;
    currency: CurrencyCode;
    targetRate: number;
    condition: 'gte' | 'lte';
    notifyPush: boolean;
    notifyEmail: boolean;
    email?: string;
  }) => PriceAlert;
  deletePriceAlert: (id: string) => void;
  togglePriceAlert: (id: string) => void;
  simulateMarketSpike: (brandId?: string, boost?: number) => void;
  pushPermissionStatus: NotificationPermission;
  requestPushPermission: () => Promise<NotificationPermission>;

  // Trade Actions
  createSellOrder: (params: {
    brandId: string;
    currency: CurrencyCode;
    faceValue: number;
    cardType: 'Physical (Receipt + Card)' | 'E-Code / Digital';
    cardNumber: string;
    cardPin?: string;
    cardImageUrl?: string;
    receiptImageUrl?: string;
    payoutDestination: PayoutDestination;
  }) => Promise<GiftCardOrder>;

  withdrawFunds: (amountNgn: number, destination: PayoutDestination) => Promise<boolean>;
}

const DEFAULT_BANKS: PayoutDestination[] = [
  {
    rail: 'nigerian_bank',
    bankName: 'Guaranty Trust Bank (GTBank)',
    accountNumber: '0249810291',
    accountName: 'CHINEDU K. EZE',
    label: 'GTBank - 0249810291',
    speed: 'Instant (1-3 mins)'
  },
  {
    rail: 'opay_palmpay',
    bankName: 'OPay Digital Services',
    accountNumber: '8031920841',
    accountName: 'CHINEDU EZE',
    label: 'OPay - 8031920841',
    speed: 'Instant (< 60s)'
  },
  {
    rail: 'usdc_crypto',
    walletAddress: '0x71C...B49f',
    label: 'USDC (Polygon / TRC20)',
    speed: 'Instant (< 2 mins)'
  }
];

const INITIAL_ALERTS: PriceAlert[] = [
  {
    id: 'alt-1',
    brandId: 'steam',
    brandName: 'Steam Wallet',
    currency: 'USD',
    baselineRate: 1680,
    targetRate: 1720,
    condition: 'gte',
    notifyPush: true,
    notifyEmail: false,
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
  },
  {
    id: 'alt-2',
    brandId: 'razer',
    brandName: 'Razer Gold',
    currency: 'USD',
    baselineRate: 1710,
    targetRate: 1750,
    condition: 'gte',
    notifyPush: true,
    notifyEmail: true,
    email: 'chinedu.eze@pensivecarding.io',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    id: 'alt-3',
    brandId: 'apple',
    brandName: 'Apple / iTunes',
    currency: 'USD',
    baselineRate: 1650,
    targetRate: 1660,
    condition: 'gte',
    notifyPush: true,
    notifyEmail: false,
    status: 'triggered',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    triggeredAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brands, setBrands] = useState<GiftCardBrand[]>(() => {
    const saved = localStorage.getItem('cardnaija_brands');
    return saved ? JSON.parse(saved) : GIFT_CARD_BRANDS;
  });

  const [orders, setOrders] = useState<GiftCardOrder[]>(() => {
    const saved = localStorage.getItem('cardnaija_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    const saved = localStorage.getItem('cardnaija_price_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [wallet, setWallet] = useState<WalletState>(() => {
    const saved = localStorage.getItem('cardnaija_wallet');
    return saved ? JSON.parse(saved) : {
      availableBalanceNgn: 498000,
      lifetimeRedeemedNgn: 2150000,
      totalCardsExchanged: 16,
      savedBanks: DEFAULT_BANKS
    };
  });

  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertModalBrandId, setAlertModalBrandId] = useState<string | null>(null);
  const [alertModalCurrency, setAlertModalCurrency] = useState<CurrencyCode>('USD');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [pushPermissionStatus, setPushPermissionStatus] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  useEffect(() => {
    localStorage.setItem('cardnaija_brands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem('cardnaija_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cardnaija_price_alerts', JSON.stringify(priceAlerts));
  }, [priceAlerts]);

  useEffect(() => {
    localStorage.setItem('cardnaija_wallet', JSON.stringify(wallet));
  }, [wallet]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const requestPushPermission = async (): Promise<NotificationPermission> => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPushPermissionStatus(perm);
        if (perm === 'granted') {
          showToast('Push notifications enabled for gift card rate spikes!');
        }
        return perm;
      } catch (err) {
        console.error('Error requesting notification permission', err);
      }
    }
    return 'denied';
  };

  const openAlertModal = (brandId?: string, currency?: CurrencyCode) => {
    setAlertModalBrandId(brandId || 'steam');
    setAlertModalCurrency(currency || 'USD');
    setIsAlertModalOpen(true);
  };

  const closeAlertModal = () => {
    setIsAlertModalOpen(false);
    setAlertModalBrandId(null);
  };

  const createPriceAlert = (params: {
    brandId: string;
    currency: CurrencyCode;
    targetRate: number;
    condition: 'gte' | 'lte';
    notifyPush: boolean;
    notifyEmail: boolean;
    email?: string;
  }): PriceAlert => {
    const brand = brands.find(b => b.id === params.brandId) || brands[0];
    let baselineRate = brand.ratePerDollar;
    if (params.currency === 'GBP' && brand.ratePerGbp) baselineRate = brand.ratePerGbp;
    else if (params.currency === 'EUR' && brand.ratePerEur) baselineRate = brand.ratePerEur;

    const newAlert: PriceAlert = {
      id: `alt-${Date.now()}`,
      brandId: brand.id,
      brandName: brand.name,
      currency: params.currency,
      baselineRate,
      targetRate: params.targetRate,
      condition: params.condition,
      notifyPush: params.notifyPush,
      notifyEmail: params.notifyEmail,
      email: params.email,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setPriceAlerts(prev => [newAlert, ...prev]);
    showToast(`Price Alert Created: We will alert you when ${brand.name} reaches ₦${params.targetRate.toLocaleString()}/${params.currency}!`);

    // Prompt for permission if requested push
    if (params.notifyPush && pushPermissionStatus === 'default') {
      requestPushPermission();
    }

    return newAlert;
  };

  const deletePriceAlert = (id: string) => {
    setPriceAlerts(prev => prev.filter(a => a.id !== id));
    showToast('Price alert deleted.');
  };

  const togglePriceAlert = (id: string) => {
    setPriceAlerts(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'paused' ? 'active' : 'paused';
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  // Simulate market fluctuation and trigger alerts that match!
  const simulateMarketSpike = (targetBrandId?: string, boost?: number) => {
    const brandToSpike = targetBrandId || 'steam';
    const boostAmt = boost || 50; // e.g. +₦50 spike

    let triggeredCount = 0;

    // Update brand rates
    setBrands(prevBrands => {
      const updated = prevBrands.map(b => {
        if (b.id === brandToSpike) {
          return {
            ...b,
            ratePerDollar: b.ratePerDollar + boostAmt,
            ratePerGbp: b.ratePerGbp ? b.ratePerGbp + boostAmt + 20 : undefined,
            ratePerEur: b.ratePerEur ? b.ratePerEur + boostAmt + 10 : undefined
          };
        }
        return b;
      });

      // Now check against priceAlerts
      setPriceAlerts(prevAlerts => {
        return prevAlerts.map(alert => {
          if (alert.brandId === brandToSpike && alert.status === 'active') {
            const updatedBrand = updated.find(b => b.id === brandToSpike);
            if (!updatedBrand) return alert;

            let currentRate = updatedBrand.ratePerDollar;
            if (alert.currency === 'GBP' && updatedBrand.ratePerGbp) currentRate = updatedBrand.ratePerGbp;
            else if (alert.currency === 'EUR' && updatedBrand.ratePerEur) currentRate = updatedBrand.ratePerEur;

            const isMet = alert.condition === 'gte' ? currentRate >= alert.targetRate : currentRate <= alert.targetRate;

            if (isMet) {
              triggeredCount++;

              // Fire in-app toast alert
              showToast(`🚨 RATE SPIKE ALERT: ${alert.brandName} hit ₦${currentRate.toLocaleString()}/${alert.currency}! Target (₦${alert.targetRate.toLocaleString()}) reached.`);

              // Fire Web Push Notification if permitted
              if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                try {
                  new Notification(`PensiveCarding Rate Alert: ${alert.brandName}`, {
                    body: `Target reached! ${alert.brandName} is now ₦${currentRate.toLocaleString()}/${alert.currency}. Cash out now for instant Naira.`,
                    icon: '/favicon.ico'
                  });
                } catch (e) {
                  console.warn('Desktop notification error', e);
                }
              }

              return {
                ...alert,
                status: 'triggered' as const,
                triggeredAt: new Date().toISOString()
              };
            }
          }
          return alert;
        });
      });

      return updated;
    });

    if (triggeredCount === 0) {
      showToast(`Market rate updated: ${brandToSpike.toUpperCase()} bumped +₦${boostAmt}. No target threshold triggered.`);
    }
  };

  const createSellOrder = async (params: {
    brandId: string;
    currency: CurrencyCode;
    faceValue: number;
    cardType: 'Physical (Receipt + Card)' | 'E-Code / Digital';
    cardNumber: string;
    cardPin?: string;
    cardImageUrl?: string;
    receiptImageUrl?: string;
    payoutDestination: PayoutDestination;
  }): Promise<GiftCardOrder> => {
    const brand = brands.find(b => b.id === params.brandId) || brands[0];
    
    let rate = brand.ratePerDollar;
    if (params.currency === 'GBP' && brand.ratePerGbp) rate = brand.ratePerGbp;
    else if (params.currency === 'EUR' && brand.ratePerEur) rate = brand.ratePerEur;

    const payoutAmountNgn = Math.round(params.faceValue * rate);
    const orderNum = `CN-NG-${Math.floor(1000 + Math.random() * 9000)}`;

    const maskedNum = params.cardNumber.length > 8
      ? `${params.cardNumber.slice(0, 4)}-••••-••••-${params.cardNumber.slice(-4)}`
      : `••••-••••-${params.cardNumber.slice(-3)}`;

    const newOrder: GiftCardOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      brandId: brand.id,
      brandName: brand.name,
      currency: params.currency,
      faceValue: params.faceValue,
      cardType: params.cardType,
      exchangeRateNgn: rate,
      payoutAmountNgn,
      status: 'completed',
      userId: 'usr-1',
      userName: 'Chinedu Eze',
      cardNumberMasked: maskedNum,
      cardPinMasked: params.cardPin ? '••••' : 'N/A',
      fullCardNumber: params.cardNumber,
      fullCardPin: params.cardPin,
      cardImageUrl: params.cardImageUrl,
      receiptImageUrl: params.receiptImageUrl,
      payoutDestination: params.payoutDestination,
      settlementTxRef: `NIBSS/TRX/${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      verificationLogs: [
        `Card submitted: ${params.currency} ${params.faceValue} ${brand.name} (${params.cardType})`,
        `Rate applied: ₦${rate.toLocaleString()}/${params.currency}`,
        `Automated balance & redemption check: Valid & unspent`,
        `Instant payout dispatched: ₦${payoutAmountNgn.toLocaleString()} sent to ${params.payoutDestination.label}`
      ]
    };

    setOrders(prev => [newOrder, ...prev]);

    setWallet(prev => ({
      ...prev,
      availableBalanceNgn: prev.availableBalanceNgn + payoutAmountNgn,
      lifetimeRedeemedNgn: prev.lifetimeRedeemedNgn + payoutAmountNgn,
      totalCardsExchanged: prev.totalCardsExchanged + 1
    }));

    showToast(`Instant Payout Sent! ₦${payoutAmountNgn.toLocaleString()} credited to ${params.payoutDestination.label}`);
    return newOrder;
  };

  const withdrawFunds = async (amountNgn: number, destination: PayoutDestination): Promise<boolean> => {
    if (amountNgn > wallet.availableBalanceNgn) {
      showToast('Insufficient wallet balance.');
      return false;
    }

    setWallet(prev => ({
      ...prev,
      availableBalanceNgn: prev.availableBalanceNgn - amountNgn
    }));

    showToast(`Withdrawn ₦${amountNgn.toLocaleString()} to ${destination.label}`);
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        brands,
        orders,
        wallet,
        priceAlerts,
        activeOrderId,
        setActiveOrderId,
        isSellModalOpen,
        setIsSellModalOpen,
        isWalletOpen,
        setIsWalletOpen,
        isAlertModalOpen,
        alertModalBrandId,
        alertModalCurrency,
        openAlertModal,
        closeAlertModal,
        toastMessage,
        showToast,
        createPriceAlert,
        deletePriceAlert,
        togglePriceAlert,
        simulateMarketSpike,
        pushPermissionStatus,
        requestPushPermission,
        createSellOrder,
        withdrawFunds
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
