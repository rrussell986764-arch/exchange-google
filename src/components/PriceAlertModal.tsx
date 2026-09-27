import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { CurrencyCode } from '../types';
import { 
  X, 
  Bell, 
  TrendingUp, 
  CheckCircle2, 
  Smartphone, 
  Mail, 
  ArrowRight,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const PriceAlertModal: React.FC = () => {
  const { 
    brands, 
    isAlertModalOpen, 
    alertModalBrandId, 
    alertModalCurrency, 
    closeAlertModal, 
    createPriceAlert,
    pushPermissionStatus,
    requestPushPermission
  } = useApp();

  const { currentUser } = useAuth();

  const [selectedBrandId, setSelectedBrandId] = useState<string>(alertModalBrandId || 'steam');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(alertModalCurrency || 'USD');
  const [targetRate, setTargetRate] = useState<number>(1720);
  const [condition, setCondition] = useState<'gte' | 'lte'>('gte');
  const [notifyPush, setNotifyPush] = useState<boolean>(true);
  const [notifyEmail, setNotifyEmail] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>(currentUser?.email || '');

  useEffect(() => {
    if (alertModalBrandId) setSelectedBrandId(alertModalBrandId);
    if (alertModalCurrency) setSelectedCurrency(alertModalCurrency);
  }, [alertModalBrandId, alertModalCurrency]);

  const brand = brands.find(b => b.id === selectedBrandId) || brands[0];

  let currentRate = brand.ratePerDollar;
  if (selectedCurrency === 'GBP' && brand.ratePerGbp) currentRate = brand.ratePerGbp;
  else if (selectedCurrency === 'EUR' && brand.ratePerEur) currentRate = brand.ratePerEur;

  // Whenever brand or currency changes, set default target to +₦40 higher
  useEffect(() => {
    setTargetRate(currentRate + 40);
  }, [selectedBrandId, selectedCurrency, currentRate]);

  if (!isAlertModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetRate <= 0) return;

    createPriceAlert({
      brandId: brand.id,
      currency: selectedCurrency,
      targetRate,
      condition,
      notifyPush,
      notifyEmail,
      email: notifyEmail ? emailInput : undefined
    });

    closeAlertModal();
  };

  const handleQuickBump = (addNgn: number) => {
    setTargetRate(currentRate + addNgn);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 sm:p-7 text-slate-100 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Naira Rate Alert</h3>
              <p className="text-xs text-slate-400">Get notified when rates spike</p>
            </div>
          </div>
          <button
            onClick={closeAlertModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pt-5 space-y-4">
          
          {/* Brand & Currency selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Gift Card
              </label>
              <select
                value={selectedBrandId}
                onChange={(e) => {
                  setSelectedBrandId(e.target.value);
                  const b = brands.find(x => x.id === e.target.value);
                  if (b && !b.supportedCurrencies.includes(selectedCurrency)) {
                    setSelectedCurrency(b.supportedCurrencies[0]);
                  }
                }}
                className="w-full p-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                {brands.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Currency
              </label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value as CurrencyCode)}
                className="w-full p-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                {brand.supportedCurrencies.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Current Rate vs Target Rate Input */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Current Market Rate:</span>
              <span className="font-mono text-emerald-400 font-bold text-sm tabular-nums">
                ₦{currentRate.toLocaleString()}/{selectedCurrency}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-white">
                  Target Alert Rate (₦ NGN)
                </label>
                <span className="text-[10px] font-mono text-emerald-400">
                  {targetRate > currentRate ? `+₦${(targetRate - currentRate).toLocaleString()} higher` : ''}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">₦</span>
                <input
                  type="number"
                  value={targetRate}
                  onChange={(e) => setTargetRate(parseInt(e.target.value) || 0)}
                  min="500"
                  step="10"
                  className="w-full pl-8 pr-3 py-2 text-sm font-mono font-bold bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Quick adjusters */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-500">Quick Targets:</span>
              {[20, 50, 100].map(bump => (
                <button
                  key={bump}
                  type="button"
                  onClick={() => handleQuickBump(bump)}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-300 hover:border-emerald-500/50 transition-colors"
                >
                  +₦{bump}
                </button>
              ))}
            </div>
          </div>

          {/* Condition toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Alert Trigger Condition
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setCondition('gte')}
                className={`p-2 rounded-lg border text-left transition-colors ${
                  condition === 'gte' ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-semibold' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div>Rises to or above (≥)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Rate reaches target spike</div>
              </button>

              <button
                type="button"
                onClick={() => setCondition('lte')}
                className={`p-2 rounded-lg border text-left transition-colors ${
                  condition === 'lte' ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-semibold' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div>Drops to or below (≤)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Rate drops threshold</div>
              </button>
            </div>
          </div>

          {/* Notification Channels */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-semibold text-slate-300">
              Notification Channels
            </label>

            {/* Browser Push */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone className="h-4 w-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-semibold text-white">Browser Push & Toast Alert</div>
                  <div className="text-[10px] text-slate-400">
                    {pushPermissionStatus === 'granted' ? 'Push permission granted ✓' : 'Instant in-app alerts'}
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifyPush}
                onChange={(e) => setNotifyPush(e.target.checked)}
                className="rounded border-slate-800 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
              />
            </div>

            {pushPermissionStatus !== 'granted' && notifyPush && (
              <button
                type="button"
                onClick={requestPushPermission}
                className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                <Smartphone className="h-3 w-3" />
                <span>Grant Browser Push Permission for Background Alerts</span>
              </button>
            )}

            {/* Email Notification */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">Email Notification</div>
                    <div className="text-[10px] text-slate-400">Receive alert in your inbox</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                />
              </div>

              {notifyEmail && (
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-white focus:outline-none focus:border-emerald-500"
                  required={notifyEmail}
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Bell className="h-4 w-4" />
            <span>Set Price Alert for ₦{targetRate.toLocaleString()}/{selectedCurrency}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
