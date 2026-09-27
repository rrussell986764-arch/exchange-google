import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { InstantSellModal } from './components/InstantSellModal';
import { LiveRates } from './components/LiveRates';
import { PriceAlertsCenter } from './components/PriceAlertsCenter';
import { PriceAlertModal } from './components/PriceAlertModal';
import { TransactionHistory } from './components/TransactionHistory';
import { PayoutsCenter } from './components/PayoutsCenter';
import { WalletDrawer } from './components/WalletDrawer';
import { AuthModal } from './components/AuthModal';
import { UserProfile } from './components/UserProfile';
import { CurrencyCode } from './types';
import { 
  Zap, 
  Building2, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Globe2, 
  ShieldCheck, 
  TrendingUp,
  LogIn,
  Bell
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    isSellModalOpen, 
    setIsSellModalOpen, 
    toastMessage 
  } = useApp();

  const { currentUser, isAuthenticated, setIsAuthModalOpen } = useAuth();

  const [activeTab, setActiveTab] = useState<'sell' | 'rates' | 'alerts' | 'orders' | 'payouts' | 'profile'>('sell');
  const [selectedBrandForSell, setSelectedBrandForSell] = useState<string>('steam');
  const [selectedAmountForSell, setSelectedAmountForSell] = useState<number>(100);
  const [selectedCurrencyForSell, setSelectedCurrencyForSell] = useState<CurrencyCode>('USD');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleStartSell = (brandId: string, amount: number, currency: CurrencyCode) => {
    setSelectedBrandForSell(brandId);
    setSelectedAmountForSell(amount);
    setSelectedCurrencyForSell(currency);
    setIsSellModalOpen(true);
  };

  const faqs = [
    {
      q: 'How fast do I get credited in my Nigerian bank account?',
      a: 'Payment is processed instantly via the NIBSS Instant Payment (NIP) network or OPay/PalmPay transfer. Once your gift card code or card picture is verified, your Naira funds reflect in your account within 1 to 3 minutes.'
    },
    {
      q: 'How does the Price Alert feature work?',
      a: 'You can set a target exchange rate (in Naira) for any gift card (e.g. Steam, Razer Gold, Apple). When market liquidity spikes and the exchange rate reaches or exceeds your target, PensiveCarding immediately sends you an in-app alert and browser push notification so you can sell at peak value.'
    },
    {
      q: 'Which currencies and countries are supported?',
      a: 'We accept gift cards worldwide in USD ($), GBP (£), EUR (€), CAD (C$), and AUD (A$). You can sell cards purchased from the US, UK, Canada, Australia, Germany, France, and other global retailers.'
    },
    {
      q: 'Which gift card brands have the highest Naira rates?',
      a: 'Razer Gold, Steam Wallet, Apple/iTunes, Sephora, Foot Locker, and Vanilla Visa consistently offer the highest exchange rates, often up to ₦1,710 per $1 USD.'
    },
    {
      q: 'Are there any withdrawal or bank transfer fees?',
      a: 'No. PensiveCarding pays 100% of the calculated Naira amount without hidden bank transfer charges or stamp duty deductions.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 border border-emerald-500/50 shadow-2xl text-xs font-semibold text-white animate-fade-in max-w-md">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1">
        {activeTab === 'sell' && (
          <div>
            <HeroSection
              onStartSellWithConfig={handleStartSell}
              onViewLiveRates={() => setActiveTab('rates')}
            />

            {/* Popular Rates Quick Section */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Today&apos;s Top Gift Card to Naira Rates</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Highest exchange rates in Nigeria with instant bank credit & price alert tracking
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('rates')}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
                >
                  View All Rates →
                </button>
              </div>

              <LiveRates onSelectBrandForSell={handleStartSell} />
            </div>

            {/* Global Reliability Section */}
            <section className="py-12 border-t border-slate-800/60 bg-slate-900/30">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded">
                    <Globe2 className="h-3.5 w-3.5" />
                    <span>Global Gift Card Exchange</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
                    Convert Any Foreign Gift Card to Naira in 3 Simple Steps
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono">
                      01
                    </div>
                    <h3 className="text-base font-bold text-white">Select Card & Currency</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Choose your gift card (Steam, Apple, Razer Gold, Sephora, Vanilla) in USD, GBP, EUR, CAD, or AUD and check the live Naira rate.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold font-mono">
                      02
                    </div>
                    <h3 className="text-base font-bold text-white">Submit Code or Photo</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Type the claim code or upload clear photos of your physical card and purchase receipt for automatic balance verification.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-mono">
                      03
                    </div>
                    <h3 className="text-base font-bold text-white">Instant Bank Alert</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Receive direct Naira transfers into GTBank, Zenith, OPay, PalmPay, Kuda, or Moniepoint within 2 minutes.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Accordion */}
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14">
              <div className="text-center mb-10">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  Help & FAQs
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">Frequently Asked Questions</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Everything you need to know about selling gift cards for Naira in Nigeria.
                </p>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-colors"
                    >
                      <span>{faq.q}</span>
                      {expandedFaq === idx ? (
                        <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {expandedFaq === idx && (
                      <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rates' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <LiveRates onSelectBrandForSell={handleStartSell} />
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <PriceAlertsCenter />
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <TransactionHistory />
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <PayoutsCenter />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {isAuthenticated && currentUser ? (
              <UserProfile />
            ) : (
              <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/60 max-w-lg mx-auto space-y-4">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <LogIn className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Sign In to Your CardNaija Account</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    View your Naira cashout history, receipts, saved Nigerian bank accounts, and price alerts.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsAuthModalOpen(true, 'login')}
                    className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsAuthModalOpen(true, 'register')}
                    className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                  >
                    Register
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Instant Sell Modal */}
      <InstantSellModal
        isOpen={isSellModalOpen}
        initialBrandId={selectedBrandForSell}
        initialAmount={selectedAmountForSell}
        initialCurrency={selectedCurrencyForSell}
        onClose={() => setIsSellModalOpen(false)}
      />

      {/* Price Alert Creation Modal */}
      <PriceAlertModal />

      {/* Wallet Drawer */}
      <WalletDrawer />

      {/* Auth Modal */}
      <AuthModal />

      {/* Refined Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-400" />
            <span className="font-bold text-slate-200">PensiveCarding Global Exchange</span>
            <span className="text-slate-600">·</span>
            <span>Instant Gift Card to Naira Payouts & Price Alerts</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <span>NIBSS Instant Payment (NIP)</span>
            <span>All Nigerian Banks & Mobile Money</span>
            <span>Live Price Spike Watchers</span>
          </div>

          <div className="text-slate-500 font-mono text-[11px]">
            © {new Date().getFullYear()} PensiveCarding. Lagos, Nigeria & Global.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
