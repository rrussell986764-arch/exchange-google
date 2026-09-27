import React from 'react';
import { useApp } from '../context/AppContext';
import { PriceAlert } from '../types';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  Zap, 
  CheckCircle2, 
  Smartphone, 
  Mail, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const PriceAlertsCenter: React.FC = () => {
  const { 
    brands, 
    priceAlerts, 
    deletePriceAlert, 
    togglePriceAlert, 
    openAlertModal, 
    simulateMarketSpike,
    pushPermissionStatus,
    requestPushPermission
  } = useApp();

  const activeAlerts = priceAlerts.filter(a => a.status === 'active');
  const triggeredAlerts = priceAlerts.filter(a => a.status === 'triggered');

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Naira Price Alerts & Watchlist</h2>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded">
              Real-time Notifications
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Get notified the instant rates surge</span>
            <span aria-hidden="true">·</span>
            <span>Browser Push & In-App Toast alerts</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">Maximize your gift card cashout value</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Market Spike Simulator button */}
          <button
            onClick={() => simulateMarketSpike('steam', 45)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-semibold text-xs transition-colors"
            title="Simulate market exchange rate movement to trigger alerts"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Simulate Rate Spike (+₦45)</span>
          </button>

          <button
            onClick={() => openAlertModal()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Alert</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-1">
            <span>Active Rate Watchers</span>
            <Bell className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">{activeAlerts.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1">Monitoring live rate ticks</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-1">
            <span>Triggered Rate Spikes</span>
            <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">{triggeredAlerts.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Target threshold reached</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-1">
            <span>Browser Push Status</span>
            <Smartphone className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <div className="text-base font-bold font-mono text-white uppercase mt-1">
            {pushPermissionStatus === 'granted' ? (
              <span className="text-emerald-400">Enabled</span>
            ) : pushPermissionStatus === 'denied' ? (
              <span className="text-rose-400">Blocked</span>
            ) : (
              <span className="text-amber-400">Default (Toast)</span>
            )}
          </div>
          {pushPermissionStatus !== 'granted' && (
            <button
              onClick={requestPushPermission}
              className="text-[10px] text-emerald-400 hover:underline mt-1 block"
            >
              Enable Browser Push →
            </button>
          )}
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-1">
            <span>Highest Current Rate</span>
            <Zap className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">₦1,710/$</div>
          <div className="text-[11px] text-slate-400 mt-1">Razer Gold (USD)</div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">Your Price Watchlist</h3>

        {priceAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40 text-xs text-slate-400">
            <Bell className="h-8 w-8 mx-auto mb-2 text-slate-600" />
            <h4 className="text-sm font-semibold text-slate-300">No price alerts active</h4>
            <p className="text-xs text-slate-500 mt-1">Set a price alert to be notified when gift card exchange rates rise.</p>
            <button
              onClick={() => openAlertModal()}
              className="mt-4 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
            >
              Set First Price Alert
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono">
                  <tr>
                    <th className="p-3.5">Gift Card</th>
                    <th className="p-3.5">Live Market Rate</th>
                    <th className="p-3.5">Target Alert Rate</th>
                    <th className="p-3.5">Condition</th>
                    <th className="p-3.5">Channels</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {priceAlerts.map(alert => {
                    const brand = brands.find(b => b.id === alert.brandId);
                    let liveRate = brand?.ratePerDollar || alert.baselineRate;
                    if (alert.currency === 'GBP' && brand?.ratePerGbp) liveRate = brand.ratePerGbp;
                    else if (alert.currency === 'EUR' && brand?.ratePerEur) liveRate = brand.ratePerEur;

                    const diff = alert.targetRate - liveRate;

                    return (
                      <tr key={alert.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-sans font-semibold text-white">
                          <div className="flex items-center gap-2">
                            <span>{alert.brandName}</span>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                              {alert.currency}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            Created {new Date(alert.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="p-3.5 text-emerald-400 font-bold text-sm tabular-nums">
                          ₦{liveRate.toLocaleString()}
                        </td>

                        <td className="p-3.5">
                          <span className="text-white font-bold tabular-nums">
                            ₦{alert.targetRate.toLocaleString()}
                          </span>
                          {diff > 0 && alert.status === 'active' && (
                            <span className="block text-[10px] text-slate-400">
                              (₦{diff} away)
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 font-sans text-slate-300">
                          {alert.condition === 'gte' ? 'Reaches or exceeds (≥)' : 'Drops to (≤)'}
                        </td>

                        <td className="p-3.5 font-sans">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            {alert.notifyPush && (
                              <span title="Push & Toast Alerts Enabled">
                                <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
                              </span>
                            )}
                            {alert.notifyEmail && (
                              <span title={alert.email || 'Email Alerts Enabled'}>
                                <Mail className="h-3.5 w-3.5 text-blue-400" />
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-3.5">
                          {alert.status === 'active' && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/70 border border-emerald-800/70 px-2 py-0.5 rounded">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>Active</span>
                            </span>
                          )}
                          {alert.status === 'triggered' && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-950/70 border border-amber-800/70 px-2 py-0.5 rounded font-bold">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Triggered</span>
                            </span>
                          )}
                          {alert.status === 'paused' && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                              <span>Paused</span>
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 text-right font-sans">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Test spike button */}
                            <button
                              onClick={() => simulateMarketSpike(alert.brandId, Math.max(diff, 30))}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-semibold transition-colors"
                              title="Trigger this rate target now"
                            >
                              Test Trigger
                            </button>

                            {/* Pause/Resume button */}
                            <button
                              onClick={() => togglePriceAlert(alert.id)}
                              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                              title={alert.status === 'paused' ? 'Resume Alert' : 'Pause Alert'}
                            >
                              {alert.status === 'paused' ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                            </button>

                            {/* Delete button */}
                            <button
                              onClick={() => deletePriceAlert(alert.id)}
                              className="p-1.5 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                              title="Delete Alert"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
