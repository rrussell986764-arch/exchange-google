import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CurrencyCode } from '../types';
import { 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Building2,
  TrendingUp,
  CreditCard,
  Globe2,
  Bell
} from 'lucide-react';

interface HeroSectionProps {
  onStartSellWithConfig: (brandId: string, amount: number, currency: CurrencyCode) => void;
  onViewLiveRates: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartSellWithConfig, onViewLiveRates }) => {
  const { brands, openAlertModal } = useApp();
  const [selectedBrandId, setSelectedBrandId] = useState<string>('steam');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');
  const [faceValue, setFaceValue] = useState<number>(100);
  const [customValue, setCustomValue] = useState<string>('100');

  const selectedBrand = brands.find(b => b.id === selectedBrandId) || brands[0];
  
  let currentRate = selectedBrand.ratePerDollar;
  if (selectedCurrency === 'GBP' && selectedBrand.ratePerGbp) currentRate = selectedBrand.ratePerGbp;
  else if (selectedCurrency === 'EUR' && selectedBrand.ratePerEur) currentRate = selectedBrand.ratePerEur;

  const totalNgnPayout = Math.round(faceValue * currentRate);

  const handleAmountSelect = (val: number) => {
    setFaceValue(val);
    setCustomValue(val.toString());
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomValue(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setFaceValue(parsed);
    }
  };

  const currencySymbols: Record<CurrencyCode, string> = {
    USD: '$',
    GBP: '£',
    EUR: '€',
    CAD: 'C$',
    AUD: 'A$'
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/5 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-full">
              <Globe2 className="h-3.5 w-3.5" />
              <span>Global Gift Card to Naira (NGN) Instant Payout</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
              Sell Gift Cards for <span className="text-emerald-400">Instant Naira</span> at the Highest Market Rates
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Exchange Steam, Apple, Razer Gold, Sephora, Vanilla Visa, Amazon, and Amex gift cards worldwide. Receive direct bank transfers to GTBank, Zenith, OPay, PalmPay, Kuda, or Moniepoint in under 2 minutes.
            </p>

            {/* Proof Points */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  <span>NIBSS Instant Transfer</span>
                </div>
                <div className="text-sm font-semibold font-mono text-slate-100 tabular-nums">&lt; 2 Minutes</div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>All Nigerian Banks</span>
                </div>
                <div className="text-sm font-semibold font-mono text-slate-100 tabular-nums">OPay, GTB, Zenith</div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
                  <span>Top Market Rate</span>
                </div>
                <div className="text-sm font-semibold font-mono text-emerald-400 tabular-nums">Up to ₦1,710/$</div>
              </div>
            </div>

            {/* Quick Hero Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onStartSellWithConfig(selectedBrandId, faceValue, selectedCurrency)}
                className="flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                <span>Sell for ₦{totalNgnPayout.toLocaleString()}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={onViewLiveRates}
                className="px-5 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-colors"
              >
                View All Live Rates
              </button>
            </div>
          </div>

          {/* Right Column: Live Naira Calculator */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
              
              {/* Header of calculator */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Naira Rate Calculator</h3>
                    <div className="text-xs text-slate-400">
                      Live rate: <span className="text-emerald-400 font-mono font-bold">₦{currentRate.toLocaleString()}/{selectedCurrency}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openAlertModal(selectedBrandId, selectedCurrency)}
                    className="flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-amber-950/70 border border-amber-800/70 hover:bg-amber-900/80 px-2 py-0.5 rounded transition-colors"
                    title="Subscribe to rate alert for this card"
                  >
                    <Bell className="h-3 w-3" />
                    <span>Set Alert</span>
                  </button>

                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                    {selectedBrand.verificationSpeed}
                  </span>
                </div>
              </div>

              {/* Step 1: Select Brand & Currency */}
              <div className="pt-5 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-slate-400">
                      1. Select Retailer or Gift Card
                    </label>
                    
                    {/* Currency Selector */}
                    <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-0.5 rounded-lg text-xs font-mono">
                      {selectedBrand.supportedCurrencies.map(curr => (
                        <button
                          key={curr}
                          type="button"
                          onClick={() => setSelectedCurrency(curr)}
                          className={`px-2 py-0.5 rounded transition-colors ${
                            selectedCurrency === curr
                              ? 'bg-emerald-500 text-slate-950 font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {curr}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {brands.slice(0, 8).map(brand => {
                      let brandRate = brand.ratePerDollar;
                      if (selectedCurrency === 'GBP' && brand.ratePerGbp) brandRate = brand.ratePerGbp;
                      else if (selectedCurrency === 'EUR' && brand.ratePerEur) brandRate = brand.ratePerEur;

                      return (
                        <button
                          key={brand.id}
                          type="button"
                          onClick={() => {
                            setSelectedBrandId(brand.id);
                            if (!brand.supportedCurrencies.includes(selectedCurrency)) {
                              setSelectedCurrency(brand.supportedCurrencies[0]);
                            }
                          }}
                          className={`px-2.5 py-2 rounded-lg text-xs font-medium text-left transition-all border ${
                            selectedBrandId === brand.id
                              ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300'
                              : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          <div className="truncate font-semibold">{brand.name}</div>
                          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                            ₦{brandRate.toLocaleString()}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Denomination selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-slate-400">
                      2. Card Amount ({currencySymbols[selectedCurrency]})
                    </label>
                    <span className="text-xs text-slate-500 font-mono">
                      Rate: ₦{currentRate.toLocaleString()} per 1 {selectedCurrency}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[25, 50, 100, 200, 500].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleAmountSelect(val)}
                        className={`flex-1 py-1.5 text-xs font-mono font-medium rounded-lg border transition-all ${
                          faceValue === val
                            ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {currencySymbols[selectedCurrency]}{val}
                      </button>
                    ))}
                    <div className="relative w-28">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                        {currencySymbols[selectedCurrency]}
                      </span>
                      <input
                        type="text"
                        value={customValue}
                        onChange={handleCustomChange}
                        placeholder="Custom"
                        className="w-full pl-7 pr-2 py-1.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Highlighted Payout Box in Naira */}
                <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20">
                  <div className="flex items-center justify-between text-xs font-medium text-emerald-400 mb-1">
                    <span className="flex items-center gap-1 font-semibold">
                      <Zap className="h-3.5 w-3.5 text-amber-400" />
                      You Receive (Instant Bank Transfer)
                    </span>
                    <span className="font-mono text-[11px] text-emerald-300 bg-emerald-900/50 px-1.5 py-0.5 rounded">
                      Zero Fees
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
                    ₦{totalNgnPayout.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                    <span>{currencySymbols[selectedCurrency]}{faceValue} × ₦{currentRate.toLocaleString()}</span>
                    <span className="text-emerald-400 font-mono">Direct NIBSS / OPay Credit</span>
                  </div>
                </div>

                {/* Supported Nigerian Banks ticker */}
                <div className="pt-1">
                  <div className="text-[11px] text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Direct Payout to Nigerian Banks & Wallets:</span>
                    <span className="text-emerald-400 font-mono text-[10px]">24/7 Automated</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap text-xs font-mono text-slate-300">
                    <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-emerald-400">GTBank</span>
                    <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-blue-400">Zenith</span>
                    <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-amber-400">OPay</span>
                    <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-purple-400">PalmPay</span>
                    <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-teal-400">Kuda</span>
                    <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-cyan-400">USDC Crypto</span>
                  </div>
                </div>

                {/* Start Exchange CTA */}
                <button
                  type="button"
                  onClick={() => onStartSellWithConfig(selectedBrandId, faceValue, selectedCurrency)}
                  className="w-full py-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-md hover:shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  <span>Sell Card & Receive ₦{totalNgnPayout.toLocaleString()}</span>
                </button>

              </div>

            </div>
          </div>

        </div>

        {/* Visual asset banner */}
        <div className="mt-14 relative rounded-2xl overflow-hidden border border-slate-800/80 max-h-56 hidden sm:block">
          <img
            src="/src/assets/images/gift_cards_spread_1790475632342.jpg"
            alt="Assorted luxury gift cards neatly displayed on dark slate stone"
            referrerPolicy="no-referrer"
            className="w-full h-56 object-cover object-center filter brightness-85 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent flex items-center p-8">
            <div className="max-w-lg space-y-2">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Fast Gift Card Liquidity</span>
              <h3 className="text-xl font-bold text-white">Sell Steam, Apple, Razer Gold & Sephora for Naira</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Physical cards with receipt and digital E-codes accepted from USA, UK, Canada, Australia, and Europe.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
