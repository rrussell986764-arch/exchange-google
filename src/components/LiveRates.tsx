import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CurrencyCode } from '../types';
import { TrendingUp, Search, Zap, Bell, CheckCircle2, Sparkles } from 'lucide-react';

interface LiveRatesProps {
  onSelectBrandForSell: (brandId: string, amount: number, currency: CurrencyCode) => void;
}

export const LiveRates: React.FC<LiveRatesProps> = ({ onSelectBrandForSell }) => {
  const { brands, openAlertModal } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Live Gift Card to Naira Rates</h2>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded">
              Updated Live
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Highest exchange rates in Nigeria</span>
            <span aria-hidden="true">·</span>
            <span>Zero hidden charges</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">Direct NIBSS instant settlement</span>
          </div>
        </div>

        {/* Search & Currency Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs font-mono">
            {(['USD', 'GBP', 'EUR', 'CAD', 'AUD'] as CurrencyCode[]).map(curr => (
              <button
                key={curr}
                onClick={() => setSelectedCurrency(curr)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedCurrency === curr ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          <div className="relative w-48 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search gift card..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Grid of Rate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBrands.map(b => {
          let rate = b.ratePerDollar;
          if (selectedCurrency === 'GBP' && b.ratePerGbp) rate = b.ratePerGbp;
          else if (selectedCurrency === 'EUR' && b.ratePerEur) rate = b.ratePerEur;

          const isSupported = b.supportedCurrencies.includes(selectedCurrency);

          return (
            <div
              key={b.id}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <span className="font-bold text-white text-base truncate">{b.name}</span>
                  {b.badge && (
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/70 border border-amber-800/70 px-2 py-0.5 rounded">
                      {b.badge}
                    </span>
                  )}
                </div>

                <div className="py-4 space-y-2">
                  <div className="text-xs text-slate-400">Current Exchange Rate:</div>
                  <div className="text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">
                    {isSupported ? `₦${rate.toLocaleString()}` : 'N/A'}
                    <span className="text-xs font-normal text-slate-400 ml-1">/{selectedCurrency}</span>
                  </div>
                  
                  <div className="text-xs text-slate-400 pt-1">
                    $100 Card yields <span className="font-bold font-mono text-white">₦{(rate * 100).toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1 border-t border-slate-800/60 pt-3">
                  <div className="flex items-center justify-between">
                    <span>Format:</span>
                    <span className="text-slate-300 truncate max-w-[150px]">{b.cardTypeOptions.join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Speed:</span>
                    <span className="text-emerald-400 font-mono">{b.verificationSpeed}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Sell + Set Price Alert */}
              <div className="pt-4 mt-2 grid grid-cols-12 gap-2">
                <button
                  onClick={() => onSelectBrandForSell(b.id, 100, selectedCurrency)}
                  className="col-span-8 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Sell {b.name}</span>
                </button>

                <button
                  onClick={() => openAlertModal(b.id, selectedCurrency)}
                  className="col-span-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-emerald-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1 border border-slate-700"
                  title={`Set price spike alert for ${b.name}`}
                >
                  <Bell className="h-3.5 w-3.5 text-amber-400" />
                  <span>Alert</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
