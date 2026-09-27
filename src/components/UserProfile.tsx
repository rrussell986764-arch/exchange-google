import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { NIGERIAN_BANKS } from '../data/brands';
import { PayoutRail } from '../types';
import { 
  User, 
  Building2, 
  KeyRound, 
  LogOut, 
  CheckCircle2, 
  Download, 
  Search, 
  Zap,
  ShieldCheck,
  FileText
} from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { currentUser, logout, updateProfile, changePassword } = useAuth();
  const { orders, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'history' | 'bank' | 'security'>('history');
  
  // Transaction Filters
  const [searchQuery, setSearchQuery] = useState('');

  // Edit Bank Details
  const [selectedBank, setSelectedBank] = useState<string>(NIGERIAN_BANKS[0].name);
  const [accountNumber, setAccountNumber] = useState<string>('0249810291');
  const [accountName, setAccountName] = useState<string>('CHINEDU K. EZE');

  // Change Password
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  if (!currentUser) return null;

  const filteredOrders = orders.filter(o => 
    o.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.payoutDestination.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      defaultPayoutRail: 'nigerian_bank',
      defaultPayoutIdentifier: `${selectedBank} - ${accountNumber}`
    });
    showToast('Bank details updated successfully.');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    const res = await changePassword(oldPassword, newPassword);
    if (res.success) {
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      showToast('Password successfully changed.');
    } else {
      setPasswordError(res.error || 'Failed to update password.');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Order Number', 'Card', 'Face Value', 'Rate', 'Naira Payout', 'Bank', 'Date', 'Status'];
    const rows = filteredOrders.map(o => [
      o.orderNumber,
      `"${o.brandName}"`,
      `${o.currency} ${o.faceValue}`,
      `₦${o.exchangeRateNgn}`,
      `₦${o.payoutAmountNgn}`,
      `"${o.payoutDestination.label}"`,
      new Date(o.createdAt).toLocaleDateString(),
      o.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PensiveCarding_Account_Statement.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Transaction statement exported as CSV.');
  };

  return (
    <div className="space-y-8">
      
      {/* Profile Overview Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          
          {/* User Identity */}
          <div className="flex items-center gap-4">
            <div
              className="h-16 w-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg border border-white/10"
              style={{ backgroundColor: currentUser.avatarBg }}
            >
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-white">{currentUser.name}</h2>
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded border text-emerald-400 bg-emerald-950/60 border-emerald-800/60">
                  Verified Trader (Nigeria)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{currentUser.email}</span>
                <span aria-hidden="true">·</span>
                <span>Member since {new Date(currentUser.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-rose-300 text-xs font-semibold transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div>
            <div className="text-xs text-slate-400">Cards Sold</div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums mt-0.5">
              {currentUser.stats.totalTrades || orders.length}
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">100% Instant Payout</div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Total Naira Redeemed</div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums mt-0.5">
              ₦{orders.reduce((acc, curr) => acc + curr.payoutAmountNgn, 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Bank transfer settlement</div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Default Payout Bank</div>
            <div className="text-sm font-bold font-mono text-emerald-400 truncate mt-1">
              GTBank
            </div>
            <div className="text-[11px] text-slate-400 truncate font-mono">
              0249810291 (CHINEDU EZE)
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Account Security</div>
            <div className="flex items-center gap-1 text-sm font-bold text-emerald-400 mt-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Protected (PBKDF2)</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">256-bit Key Encryption</div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            activeTab === 'history'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Transaction History ({filteredOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('bank')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            activeTab === 'bank'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Saved Nigerian Bank
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            activeTab === 'security'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Security & Password
        </button>
      </div>

      {/* TAB 1: TRANSACTION HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order ref, card, bank..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors shrink-0"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              <span>Export Statement (CSV)</span>
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono">
                  <tr>
                    <th className="p-3.5">Order Ref</th>
                    <th className="p-3.5">Card Brand</th>
                    <th className="p-3.5">Face Value</th>
                    <th className="p-3.5">Rate</th>
                    <th className="p-3.5 text-right">Naira Paid</th>
                    <th className="p-3.5">Bank Destination</th>
                    <th className="p-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredOrders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-emerald-400">{o.orderNumber}</td>
                      <td className="p-3.5 font-sans font-semibold text-white">{o.brandName}</td>
                      <td className="p-3.5 text-slate-300">{o.currency} {o.faceValue}</td>
                      <td className="p-3.5 text-slate-300">₦{o.exchangeRateNgn.toLocaleString()}</td>
                      <td className="p-3.5 text-right text-emerald-400 font-bold tabular-nums">
                        ₦{o.payoutAmountNgn.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-slate-300 font-sans truncate max-w-[150px]">{o.payoutDestination.label}</td>
                      <td className="p-3.5 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Paid</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SAVED NIGERIAN BANK */}
      {activeTab === 'bank' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 space-y-4 max-w-xl">
          <div>
            <h3 className="text-sm font-bold text-white">Default Nigerian Payout Bank</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Naira from sold gift cards will be transferred directly to this account via NIBSS.
            </p>
          </div>

          <form onSubmit={handleSaveBank} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Bank Name
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
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                10-Digit NUBAN Account Number
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
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Account Name (Matches BVN / NIN)
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
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
            >
              Update Payout Account
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: SECURITY & PASSWORD */}
      {activeTab === 'security' && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 space-y-4 max-w-xl">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Change Account Password</h3>
          </div>

          {passwordError && (
            <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/50 text-xs text-rose-300">
              {passwordError}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">New Password (8+ characters)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full p-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
            >
              Update Password
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
