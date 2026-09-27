import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Zap, Wallet, ArrowUpRight, User, LogIn, TrendingUp, Bell } from 'lucide-react';

interface NavbarProps {
  activeTab: 'sell' | 'rates' | 'alerts' | 'orders' | 'payouts' | 'profile';
  setActiveTab: (tab: 'sell' | 'rates' | 'alerts' | 'orders' | 'payouts' | 'profile') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { wallet, priceAlerts, setIsSellModalOpen, setIsWalletOpen } = useApp();
  const { currentUser, isAuthenticated, setIsAuthModalOpen } = useAuth();

  const activeAlertsCount = priceAlerts.filter(a => a.status === 'active').length;
  const triggeredAlertsCount = priceAlerts.filter(a => a.status === 'triggered').length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('sell');
            }}
            className="flex items-center gap-2 group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500/25 transition-colors">
              <Zap className="h-5 w-5 fill-emerald-400/20" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
              PensiveCarding
            </span>
          </a>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
            <span>Instant Naira</span>
            <span className="text-slate-500">·</span>
            <span>24/7 Global</span>
          </span>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('sell')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'sell'
                ? 'text-emerald-400 bg-slate-900 border border-slate-800'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            Sell Gift Card
          </button>
          <button
            onClick={() => setActiveTab('rates')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'rates'
                ? 'text-emerald-400 bg-slate-900 border border-slate-800'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            Live Naira Rates
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'alerts'
                ? 'text-emerald-400 bg-slate-900 border border-slate-800'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Bell className="h-3.5 w-3.5 text-amber-400" />
            <span>Price Alerts</span>
            {activeAlertsCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                {activeAlertsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'orders'
                ? 'text-emerald-400 bg-slate-900 border border-slate-800'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'payouts'
                ? 'text-emerald-400 bg-slate-900 border border-slate-800'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            Nigerian Banks
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'profile'
                ? 'text-emerald-400 bg-slate-900 border border-slate-800'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            Account
          </button>
        </nav>

        {/* Zone 3: Actions & User Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Price alert icon button for mobile */}
          <button
            onClick={() => setActiveTab('alerts')}
            className={`md:hidden p-2 rounded-lg border transition-colors relative ${
              activeTab === 'alerts'
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
            }`}
            title="Price Alerts"
          >
            <Bell className="h-4 w-4 text-amber-400" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border border-slate-950" />
            )}
          </button>

          {/* Wallet Balance Pill in Naira */}
          <button
            onClick={() => setIsWalletOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 hover:text-white transition-colors"
            title="Open Naira Wallet"
          >
            <Wallet className="h-4 w-4 text-emerald-400" />
            <span className="font-mono text-sm font-semibold tabular-nums text-emerald-400">
              ₦{wallet.availableBalanceNgn.toLocaleString()}
            </span>
          </button>

          {/* User Account / Profile button */}
          {isAuthenticated && currentUser ? (
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-colors ${
                activeTab === 'profile'
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-200'
              }`}
              title="View Account Profile"
            >
              <div
                className="h-6 w-6 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: currentUser.avatarBg }}
              >
                {currentUser.name[0]}
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold max-w-[90px] truncate">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true, 'login')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition-colors"
            >
              <LogIn className="h-3.5 w-3.5 text-emerald-400" />
              <span>Sign In</span>
            </button>
          )}

          {/* Sell Card CTA */}
          <button
            onClick={() => setIsSellModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-emerald-500/20 whitespace-nowrap"
          >
            <span>Sell Card</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>

        </div>
      </div>
    </header>
  );
};
