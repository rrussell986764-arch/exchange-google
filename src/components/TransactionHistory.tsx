import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GiftCardOrder } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  Search, 
  Download, 
  FileText, 
  Copy, 
  Check, 
  Building2, 
  Zap,
  ArrowRight
} from 'lucide-react';

interface TransactionHistoryProps {
  onSelectOrder?: (orderId: string) => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = () => {
  const { orders, showToast, setIsSellModalOpen } = useApp();
  const [search, setSearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<GiftCardOrder | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  const filteredOrders = orders.filter(o => 
    o.brandName.toLowerCase().includes(search.toLowerCase()) ||
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.payoutDestination.label.toLowerCase().includes(search.toLowerCase())
  );

  const copyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(ref);
    showToast('Copied reference number');
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = ['Order Number', 'Gift Card', 'Face Value', 'Exchange Rate', 'Naira Payout (NGN)', 'Bank / Destination', 'Date', 'Status'];
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
    link.setAttribute('download', `PensiveCarding_Statement_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported CSV transaction statement.');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Naira Transaction History</h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>All completed gift card cashouts</span>
            <span aria-hidden="true">·</span>
            <span>Direct NIBSS instant settlement receipts</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsSellModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
          >
            <span>+ Sell Another Card</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order ref, brand, or bank..."
          className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40 text-xs text-slate-400">
          No transactions found. Sell your first gift card for instant Naira!
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono">
                <tr>
                  <th className="p-3.5">Order Ref</th>
                  <th className="p-3.5">Gift Card</th>
                  <th className="p-3.5">Face Value</th>
                  <th className="p-3.5">Rate</th>
                  <th className="p-3.5 text-right">Naira Credited</th>
                  <th className="p-3.5">Bank Account / Wallet</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredOrders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <span className="text-emerald-400 font-bold">{o.orderNumber}</span>
                      <div className="text-[10px] text-slate-500">
                        {new Date(o.createdAt).toLocaleDateString()} {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="p-3.5 font-sans font-semibold text-white">
                      {o.brandName}
                      <span className="block text-[11px] font-mono text-slate-400 font-normal">{o.cardType}</span>
                    </td>
                    <td className="p-3.5 text-slate-200">
                      {o.currency} {o.faceValue}
                    </td>
                    <td className="p-3.5 text-slate-300">
                      ₦{o.exchangeRateNgn.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right text-emerald-400 font-bold text-sm tabular-nums">
                      ₦{o.payoutAmountNgn.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-slate-300 font-sans truncate max-w-[160px]">
                      {o.payoutDestination.label}
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Paid</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedReceipt(o)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors inline-flex items-center gap-1 text-[11px] font-sans font-medium"
                      >
                        <FileText className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Naira Payment Receipt</h3>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Order Reference:</span>
                <span className="text-emerald-400 font-bold">{selectedReceipt.orderNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 font-sans">
                <span className="text-slate-400">Card Sold:</span>
                <span className="text-white font-semibold">{selectedReceipt.currency} {selectedReceipt.faceValue} {selectedReceipt.brandName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Exchange Rate:</span>
                <span className="text-slate-200 tabular-nums">₦{selectedReceipt.exchangeRateNgn.toLocaleString()} / {selectedReceipt.currency}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Naira Paid Out:</span>
                <span className="text-emerald-400 font-bold text-base tabular-nums">₦{selectedReceipt.payoutAmountNgn.toLocaleString()} NGN</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Beneficiary Bank:</span>
                <span className="text-white">{selectedReceipt.payoutDestination.label}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">NIBSS Reference:</span>
                <span className="text-slate-300 truncate max-w-[180px]">{selectedReceipt.settlementTxRef || 'NIBSS/0921498102'}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300">Verification Trail:</div>
              {selectedReceipt.verificationLogs.map((log, i) => (
                <div key={i} className="text-slate-500">› {log}</div>
              ))}
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
