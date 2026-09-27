import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NIGERIAN_BANKS } from '../data/brands';
import { PayoutDestination } from '../types';
import { 
  X, 
  Wallet, 
  Building2, 
  ArrowUpRight, 
  CheckCircle2, 
  Zap
} from 'lucide-react';

export const WalletDrawer: React.FC = () => {
  const { isWalletOpen, setIsWalletOpen, wallet, withdrawFunds } = useApp();
  const [withdrawAmountNgn, setWithdrawAmountNgn] = useState<string>('50000');
  const [selectedBank, setSelectedBank] = useState<string>(NIGERIAN_BANKS[0].name);
  const [accountNumber, setAccountNumber] = useState<string>('0249810291');
  const [accountName, setAccountName] = useState<string>('CHINEDU K. EZE');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isWalletOpen) return null;

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(withdrawAmountNgn, 10);
    if (isNaN(amt) || amt <= 0 || amt > wallet.availableBalanceNgn) return;

    setIsProcessing(true);
    const dest: PayoutDestination = {
      rail: 'nigerian_bank',
      bankName: selectedBank,
      accountNumber,
      accountName,
      label: `${selectedBank} (${accountNumber})`,
      speed: 'Instant (1-2 mins)'
    };

    setTimeout(async () => {
      await withdrawFunds(amt, dest);
      setIsProcessing(false);
      setWithdrawAmountNgn('');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto text-slate-100 shadow-2xl">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Wallet className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Naira Wallet Balance</h3>
                <p className="text-[11px] text-slate-400">Instant Nigerian Bank Withdrawal</p>
              </div>
            </div>
            <button
              onClick={() => setIsWalletOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Balances Card */}
          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 space-y-4">
            <div>
              <div className="text-xs text-slate-400 font-medium">Available Cash (Naira)</div>
              <div className="text-3xl font-extrabold font-mono text-emerald-400 tabular-nums mt-1">
                ₦{wallet.availableBalanceNgn.toLocaleString()} NGN
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
              <div>
                <div className="text-[11px] text-slate-400">Total Cards Sold</div>
                <div className="text-sm font-bold font-mono text-slate-200 tabular-nums">
                  {wallet.totalCardsExchanged} Cards
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-400">Lifetime Redeemed</div>
                <div className="text-sm font-bold font-mono text-slate-200 tabular-nums">
                  ₦{wallet.lifetimeRedeemedNgn.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Instant Withdrawal Form */}
          <div className="mt-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Instant Bank Transfer Withdrawal
            </h4>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span>Withdrawal Amount (₦ NGN)</span>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmountNgn(wallet.availableBalanceNgn.toString())}
                    className="text-emerald-400 font-mono hover:underline"
                  >
                    Max: ₦{wallet.availableBalanceNgn.toLocaleString()}
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">₦</span>
                  <input
                    type="number"
                    value={withdrawAmountNgn}
                    onChange={(e) => setWithdrawAmountNgn(e.target.value)}
                    max={wallet.availableBalanceNgn}
                    min="1000"
                    step="500"
                    className="w-full pl-8 pr-3.5 py-2.5 text-sm font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    placeholder="50,000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Destination Bank
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
                <label className="block text-xs text-slate-400 mb-1.5">
                  NUBAN Account Number
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Account Name
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing || wallet.availableBalanceNgn <= 0 || !withdrawAmountNgn}
                className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Zap className="h-4 w-4" />
                <span>
                  {isProcessing ? 'Sending to Bank...' : `Transfer ₦${withdrawAmountNgn ? parseInt(withdrawAmountNgn).toLocaleString() : '0'} to Bank`}
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>0% Transfer Fees · NIBSS Instant Pay Network</span>
          </div>
          <div>Funds typically arrive in your Nigerian bank account within 60 seconds.</div>
        </div>

      </div>
    </div>
  );
};
