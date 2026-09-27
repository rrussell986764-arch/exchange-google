import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NIGERIAN_BANKS } from '../data/brands';
import { PayoutRail, PayoutDestination } from '../types';
import { 
  Building2, 
  Zap, 
  CheckCircle2, 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  DollarSign, 
  ShieldCheck,
  Globe2,
  Smartphone
} from 'lucide-react';

export const PayoutsCenter: React.FC = () => {
  const { wallet, orders, showToast, setIsWalletOpen } = useApp();
  const [selectedBank, setSelectedBank] = useState<string>(NIGERIAN_BANKS[0].name);
  const [accountNumber, setAccountNumber] = useState<string>('0249810291');
  const [accountName, setAccountName] = useState<string>('CHINEDU K. EZE');

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Saved default bank: ${selectedBank} (${accountNumber}) - ${accountName}`);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Nigerian Bank Transfer Rails & Payouts</h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Direct NIBSS Instant Payment (NIP)</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">Zero withdrawal fees</span>
            <span aria-hidden="true">·</span>
            <span>All Commercial & Microfinance Banks in Nigeria</span>
          </div>
        </div>

        <button
          onClick={() => setIsWalletOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
        >
          <Wallet className="h-4 w-4" />
          <span>Withdraw ₦{wallet.availableBalanceNgn.toLocaleString()}</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-1">
            <span>Average Payout Speed</span>
            <Zap className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">45s – 2m</div>
          <div className="text-[11px] text-emerald-400 mt-1">Direct NIBSS settlement</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-1">
            <span>Transfer Fee</span>
            <Building2 className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">₦0.00</div>
          <div className="text-[11px] text-slate-400 mt-1">100% Free transfers</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-1">
            <span>Supported Nigerian Banks</span>
            <Building2 className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">30+ Banks</div>
          <div className="text-[11px] text-slate-400 mt-1">All commercial + Fintechs</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-1">
            <span>Lifetime Naira Redeemed</span>
            <Wallet className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            ₦{wallet.lifetimeRedeemedNgn.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{wallet.totalCardsExchanged} gift cards exchanged</div>
        </div>
      </div>

      {/* Main Layout: Bank Directory & Add Bank Account */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Popular Banks Directory */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-white">Popular Instant Payout Channels</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'OPay Digital Services', desc: 'Instant mobile wallet credit (< 30s)', badge: 'FASTEST', speed: '30 secs' },
              { name: 'Guaranty Trust Bank (GTBank)', desc: 'Direct corporate NIBSS transfer', badge: 'POPULAR', speed: '1-2 mins' },
              { name: 'Zenith Bank', desc: 'Direct account instant credit', badge: 'RELIABLE', speed: '1-2 mins' },
              { name: 'PalmPay Limited', desc: 'Instant fintech wallet credit', badge: 'INSTANT', speed: '45 secs' },
              { name: 'First Bank of Nigeria', desc: 'Nationwide retail bank credit', badge: 'ACTIVE', speed: '2 mins' },
              { name: 'Kuda Microfinance Bank', desc: 'Mobile bank instant credit', badge: 'ZERO FEE', speed: '1 min' },
              { name: 'Moniepoint MFB', desc: 'Business & personal accounts', badge: 'POPULAR', speed: '1 min' },
              { name: 'United Bank for Africa (UBA)', desc: 'Instant NIP corporate routing', badge: 'ACTIVE', speed: '2 mins' }
            ].map((b, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate">{b.name}</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-1.5 py-0.2 rounded">
                    {b.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{b.desc}</p>
                <div className="text-[10px] text-slate-500 font-mono pt-1">
                  Speed: <span className="text-slate-300">{b.speed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Default Bank Account Settings */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-400" />
              <span>Configure Default Nigerian Bank Account</span>
            </h3>

            <form onSubmit={handleSaveBank} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Select Nigerian Bank
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  {NIGERIAN_BANKS.map(b => (
                    <option key={b.code} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  NUBAN Account Number (10 Digits)
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 0249810291"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Account Name (Verified with NIBSS)
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. CHINEDU K. EZE"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Save Payout Account
              </button>
            </form>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>NIBSS Instant Settlement Guarantee</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              CardNaija routes all payments via automated banking APIs directly to Nigerian accounts. Funds reflect instantly with credit alerts.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
