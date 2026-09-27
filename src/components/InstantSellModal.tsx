import React, { useState, useEffect } from 'react';
import { GIFT_CARD_BRANDS, NIGERIAN_BANKS } from '../data/brands';
import { useApp } from '../context/AppContext';
import { PayoutDestination, PayoutRail, CurrencyCode } from '../types';
import { 
  X, 
  Zap, 
  CheckCircle2, 
  Loader2, 
  Camera, 
  Building2, 
  ArrowRight,
  Upload,
  CreditCard,
  AlertCircle
} from 'lucide-react';

interface InstantSellModalProps {
  initialBrandId?: string;
  initialAmount?: number;
  initialCurrency?: CurrencyCode;
  isOpen: boolean;
  onClose: () => void;
}

export const InstantSellModal: React.FC<InstantSellModalProps> = ({
  initialBrandId,
  initialAmount,
  initialCurrency,
  isOpen,
  onClose
}) => {
  const { createSellOrder, setActiveOrderId } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedBrandId, setSelectedBrandId] = useState<string>(initialBrandId || 'steam');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(initialCurrency || 'USD');
  const [faceValue, setFaceValue] = useState<number>(initialAmount || 100);
  const [cardType, setCardType] = useState<'Physical (Receipt + Card)' | 'E-Code / Digital'>('E-Code / Digital');

  // Card Credentials & Image
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardPin, setCardPin] = useState<string>('');
  const [hasReceiptImage, setHasReceiptImage] = useState<boolean>(false);
  const [hasCardImage, setHasCardImage] = useState<boolean>(false);

  // Bank & Payout Details
  const [selectedRail, setSelectedRail] = useState<PayoutRail>('nigerian_bank');
  const [selectedBankName, setSelectedBankName] = useState<string>(NIGERIAN_BANKS[0].name);
  const [accountNumber, setAccountNumber] = useState<string>('0249810291');
  const [accountName, setAccountName] = useState<string>('CHINEDU K. EZE');
  const [walletAddress, setWalletAddress] = useState<string>('');

  // Processing & Success State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string>('');
  const [payoutAmountNgn, setPayoutAmountNgn] = useState<number>(0);

  const brand = GIFT_CARD_BRANDS.find(b => b.id === selectedBrandId) || GIFT_CARD_BRANDS[0];

  useEffect(() => {
    if (initialBrandId) setSelectedBrandId(initialBrandId);
    if (initialAmount) setFaceValue(initialAmount);
    if (initialCurrency) setSelectedCurrency(initialCurrency);
  }, [initialBrandId, initialAmount, initialCurrency]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsSubmitting(false);
      setCreatedOrderNumber('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  let currentRate = brand.ratePerDollar;
  if (selectedCurrency === 'GBP' && brand.ratePerGbp) currentRate = brand.ratePerGbp;
  else if (selectedCurrency === 'EUR' && brand.ratePerEur) currentRate = brand.ratePerEur;

  const totalNgn = Math.round(faceValue * currentRate);

  const handleAutoFillSample = () => {
    if (brand.id === 'steam') {
      setCardNumber('STEAM-49210-77821-8910');
      setCardPin('');
    } else if (brand.id === 'apple') {
      setCardNumber('XQ98-4421-9901-4102');
      setCardPin('9021');
    } else if (brand.id === 'razer') {
      setCardNumber('RG-889102498102');
      setCardPin('44810284');
    } else {
      setCardNumber('4128-9941-2048-7712');
      setCardPin('4821');
    }
    setHasCardImage(true);
    setHasReceiptImage(true);
  };

  const handleExecuteSell = async () => {
    setIsSubmitting(true);

    const destination: PayoutDestination = {
      rail: selectedRail,
      bankName: selectedRail === 'nigerian_bank' ? selectedBankName : selectedRail === 'opay_palmpay' ? 'OPay / PalmPay' : undefined,
      accountNumber: selectedRail !== 'usdc_crypto' ? accountNumber : undefined,
      accountName: selectedRail !== 'usdc_crypto' ? accountName : undefined,
      walletAddress: selectedRail === 'usdc_crypto' ? walletAddress : undefined,
      label: selectedRail === 'nigerian_bank' ? `${selectedBankName} (${accountNumber})` : selectedRail === 'opay_palmpay' ? `OPay (${accountNumber})` : `USDC (${walletAddress || '0x71...49f'})`,
      speed: 'Instant (1-3 mins)'
    };

    setTimeout(async () => {
      const order = await createSellOrder({
        brandId: brand.id,
        currency: selectedCurrency,
        faceValue,
        cardType,
        cardNumber,
        cardPin: brand.pinRequired ? cardPin : undefined,
        cardImageUrl: hasCardImage ? 'https://cardnaija.io/uploads/card-sample.jpg' : undefined,
        receiptImageUrl: hasReceiptImage ? 'https://cardnaija.io/uploads/receipt-sample.jpg' : undefined,
        payoutDestination: destination
      });

      setCreatedOrderNumber(order.orderNumber);
      setPayoutAmountNgn(order.payoutAmountNgn);
      setIsSubmitting(false);
      setStep(4); // Success Receipt
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 sm:p-8 text-slate-100 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Sell Gift Card for Naira</h2>
              <p className="text-xs text-slate-400">Step {step} of 4 · Direct Bank Transfer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* STEP 1: Card Brand, Currency & Face Value */}
        {step === 1 && (
          <div className="pt-6 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Select Gift Card
                </label>
                <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-0.5 rounded-lg text-xs font-mono">
                  {brand.supportedCurrencies.map(curr => (
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

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                {GIFT_CARD_BRANDS.map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setSelectedBrandId(b.id);
                      if (!b.supportedCurrencies.includes(selectedCurrency)) {
                        setSelectedCurrency(b.supportedCurrencies[0]);
                      }
                    }}
                    className={`p-2.5 rounded-lg text-xs font-medium text-left border transition-all ${
                      selectedBrandId === b.id
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold truncate">{b.name}</div>
                    <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                      ₦{b.ratePerDollar.toLocaleString()}/$
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Type selection: Physical vs E-Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Card Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                {brand.cardTypeOptions.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setCardType(t)}
                    className={`p-3 rounded-xl text-left border transition-all text-xs ${
                      cardType === t
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Card Amount ({selectedCurrency})
              </label>
              <div className="flex items-center gap-2">
                {[25, 50, 100, 200, 500].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setFaceValue(v)}
                    className={`flex-1 py-2 text-xs font-mono rounded-lg border transition-all ${
                      faceValue === v
                        ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Naira Value Display */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Card Value:</span>
                <span className="font-mono text-white tabular-nums">{selectedCurrency} {faceValue}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Current Rate:</span>
                <span className="font-mono text-emerald-400 font-semibold tabular-nums">₦{currentRate.toLocaleString()} per 1 {selectedCurrency}</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-sm">
                <span className="font-bold text-white">Naira (NGN) Payout:</span>
                <span className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
                  ₦{totalNgn.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Continue to Card Details</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Card Code, Scratch PIN & Upload Photos */}
        {step === 2 && (
          <div className="pt-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Selected Card:</span>
                <div className="text-sm font-bold text-white">
                  {selectedCurrency} {faceValue} {brand.name} ({cardType})
                </div>
              </div>
              <button
                type="button"
                onClick={handleAutoFillSample}
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-mono bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded"
              >
                <Camera className="h-3.5 w-3.5" />
                <span>Auto-Fill Demo Card</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Card Claim Code / Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder={brand.cardNumberFormat}
                  className="w-full px-3.5 py-2.5 text-sm font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {brand.pinRequired && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Scratch-Off PIN / Access Code ({brand.pinLength} digits)
                  </label>
                  <input
                    type="password"
                    value={cardPin}
                    onChange={(e) => setCardPin(e.target.value)}
                    placeholder="Enter scratch-off PIN"
                    className="w-full px-3.5 py-2.5 text-sm font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {/* Photo Upload Simulator (Card Photo & Receipt Photo) */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div
                  onClick={() => setHasCardImage(!hasCardImage)}
                  className={`p-3 rounded-xl border border-dashed text-center cursor-pointer transition-colors ${
                    hasCardImage ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Upload className="h-4 w-4 mx-auto mb-1 text-slate-400" />
                  <div className="text-[11px] font-semibold">{hasCardImage ? 'Card Photo Attached ✓' : 'Upload Card Photo'}</div>
                  <div className="text-[10px] text-slate-500">Back of card showing code</div>
                </div>

                <div
                  onClick={() => setHasReceiptImage(!hasReceiptImage)}
                  className={`p-3 rounded-xl border border-dashed text-center cursor-pointer transition-colors ${
                    hasReceiptImage ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Upload className="h-4 w-4 mx-auto mb-1 text-slate-400" />
                  <div className="text-[11px] font-semibold">{hasReceiptImage ? 'Receipt Attached ✓' : 'Upload Store Receipt'}</div>
                  <div className="text-[10px] text-slate-500">Cash / debit store receipt</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!cardNumber}
                onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Select Bank Account</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Nigerian Bank & Payout Rail */}
        {step === 3 && (
          <div className="pt-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select Nigerian Payout Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRail('nigerian_bank')}
                  className={`p-2.5 rounded-lg text-xs font-medium text-left border transition-all ${
                    selectedRail === 'nigerian_bank'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold">Nigerian Bank</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">GTB, Zenith, FirstBank</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRail('opay_palmpay')}
                  className={`p-2.5 rounded-lg text-xs font-medium text-left border transition-all ${
                    selectedRail === 'opay_palmpay'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold">OPay / PalmPay</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">Instant Mobile Wallet</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRail('usdc_crypto')}
                  className={`p-2.5 rounded-lg text-xs font-medium text-left border transition-all ${
                    selectedRail === 'usdc_crypto'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold">USDC Crypto</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">Global TRC20 / Polygon</div>
                </button>
              </div>
            </div>

            {selectedRail === 'nigerian_bank' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Bank Name
                  </label>
                  <select
                    value={selectedBankName}
                    onChange={(e) => setSelectedBankName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    {NIGERIAN_BANKS.map(b => (
                      <option key={b.code} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      NUBAN Account Number (10 digits)
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
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Account Name
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
                </div>
              </div>
            )}

            {selectedRail === 'opay_palmpay' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    OPay / PalmPay Phone Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="e.g. 08031920841"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Registered Name
                  </label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="e.g. CHINEDU EZE"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>
            )}

            {selectedRail === 'usdc_crypto' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  USDC TRC20 / Polygon Address
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0x... or T..."
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {/* Payout Summary */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Card:</span>
                <span className="text-white font-medium">{selectedCurrency} {faceValue} {brand.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Bank / Payout Destination:</span>
                <span className="text-emerald-400 font-mono">
                  {selectedRail === 'nigerian_bank' ? `${selectedBankName} (${accountNumber})` : selectedRail === 'opay_palmpay' ? `OPay (${accountNumber})` : 'USDC Wallet'}
                </span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex items-center justify-between">
                <span className="text-sm font-bold text-white">Amount to be Credited:</span>
                <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                  ₦{totalNgn.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-3 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleExecuteSell}
                className="flex-1 py-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying & Sending Naira...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    <span>Confirm Sell & Receive ₦{totalNgn.toLocaleString()}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Success & Payment Proof Receipt */}
        {step === 4 && (
          <div className="pt-6 space-y-6 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Naira Transfer Dispatched!</h3>
              <p className="text-xs text-slate-400 mt-1">
                ₦{payoutAmountNgn.toLocaleString()} has been sent to your bank account via instant transfer.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span>Order Reference:</span>
                <span className="text-white font-bold">{createdOrderNumber}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Amount Paid:</span>
                <span className="text-emerald-400 font-bold tabular-nums">₦{payoutAmountNgn.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Beneficiary:</span>
                <span className="text-white">{accountName} ({accountNumber})</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Bank:</span>
                <span className="text-white">{selectedRail === 'nigerian_bank' ? selectedBankName : 'OPay Digital'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Transfer Status:</span>
                <span className="text-emerald-400 font-semibold">Credited (NIBSS Instant)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
