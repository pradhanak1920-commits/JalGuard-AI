import React, { useState } from 'react';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  IndianRupee,
  Droplets,
  Truck,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  PieChart,
} from 'lucide-react';
import { MONTHLY_ANALYTICS_DATA } from '../../data/mockData';

export const AnalyticsView: React.FC = () => {
  const [metricView, setMetricView] = useState<'consumption' | 'cost'>('consumption');

  const maxConsumption = Math.max(...MONTHLY_ANALYTICS_DATA.map((d) => d.consumptionLakhs));
  const maxCost = Math.max(...MONTHLY_ANALYTICS_DATA.map((d) => d.costInr));

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Water Operations Analytics
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Zero Shortages (6 Months)
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Historical consumption trends, procurement savings, and supplier compliance metrics.
        </p>
      </div>

      {/* KPI Cards Grid (8 metrics as specified) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Monthly Avg Consumption</div>
          <div className="text-xl font-extrabold text-slate-900 mt-1 tabular-nums">
            24.8 Lakh L
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5 flex items-center gap-0.5 font-semibold">
            <TrendingDown className="w-3 h-3" />
            -4.2% vs last year
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Procurement Spend (MTD)</div>
          <div className="text-xl font-extrabold text-slate-900 mt-1 tabular-nums">
            ₹41,000
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5 font-semibold">
            ₹14,200 saved via early booking
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Tanker Orders (MTD)</div>
          <div className="text-xl font-extrabold text-slate-900 mt-1 tabular-nums">
            22 Tankers
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">264,000 L delivered</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Emergency Orders Avoided</div>
          <div className="text-xl font-extrabold text-emerald-600 mt-1 tabular-nums">
            45 Tankers
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5 font-semibold">
            Zero surge rate premiums
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Water Wastage Reduced</div>
          <div className="text-xl font-extrabold text-sky-700 mt-1 tabular-nums">
            18.5%
          </div>
          <div className="text-[11px] text-sky-600 mt-0.5 font-medium">Overhead overflow arrested</div>
        </div>

        {/* Metric 6 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">AI Forecast Accuracy</div>
          <div className="text-xl font-extrabold text-purple-700 mt-1 tabular-nums">
            93.4%
          </div>
          <div className="text-[11px] text-purple-600 mt-0.5 font-medium">Confidence margin &lt; 5%</div>
        </div>

        {/* Metric 7 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Dry Tap Incidents</div>
          <div className="text-xl font-extrabold text-emerald-600 mt-1 tabular-nums">
            0 Shortages
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Since JalGuard deployment</div>
        </div>

        {/* Metric 8 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Supplier On-Time Rate</div>
          <div className="text-xl font-extrabold text-slate-900 mt-1 tabular-nums">
            91.2%
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5 font-semibold">Avg ETA: 52 mins</div>
        </div>
      </div>

      {/* Monthly Chart Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              {metricView === 'consumption'
                ? 'Monthly Water Consumption Trend (Lakh Litres)'
                : 'Monthly Procurement Cost Trend (₹)'}
            </h3>
            <p className="text-xs text-slate-500">
              Comparing seasonal heatwave demand vs winter months
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setMetricView('consumption')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                metricView === 'consumption'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Water Volume (L)
            </button>
            <button
              onClick={() => setMetricView('cost')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                metricView === 'cost'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Procurement Cost (₹)
            </button>
          </div>
        </div>

        {/* Bar chart rendering */}
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 border-b border-slate-200 px-2 sm:px-6">
          {MONTHLY_ANALYTICS_DATA.map((item) => {
            const heightPct =
              metricView === 'consumption'
                ? Math.round((item.consumptionLakhs / maxConsumption) * 100)
                : Math.round((item.costInr / maxCost) * 100);

            return (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full flex items-end justify-center h-full">
                  <div
                    className={`w-full max-w-[48px] rounded-t-md transition-all duration-300 relative ${
                      metricView === 'consumption'
                        ? 'bg-sky-500 group-hover:bg-sky-600'
                        : 'bg-emerald-500 group-hover:bg-emerald-600'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  >
                    {/* Hover tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-20">
                      {metricView === 'consumption'
                        ? `${item.consumptionLakhs} Lakh L`
                        : `₹${item.costInr.toLocaleString()}`}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 group-hover:text-slate-900">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend / summary below chart */}
        <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div>
            Highest Month: <strong className="text-slate-900">May (29.2 Lakh L · ₹68,500)</strong>
          </div>
          <div>
            Lowest Month: <strong className="text-slate-900">February (23.1 Lakh L · ₹52,000)</strong>
          </div>
        </div>
      </div>

      {/* Water Sources Split & Efficiency Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Mix */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 mb-3">Water Source Dependency Mix</h3>
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-700">BWSSB Municipal Piped Mains</span>
                <span className="font-mono font-bold text-sky-700">52% (12.6 Lakh L / mo)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: '52%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-700">On-Premises Borewells (2 Units)</span>
                <span className="font-mono font-bold text-blue-700">28% (6.8 Lakh L / mo)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-700">Private Water Tankers</span>
                <span className="font-mono font-bold text-amber-700">20% (4.8 Lakh L / mo)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Operational ROI */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">JalGuard AI Operational ROI</h3>
            <p className="text-xs text-slate-500 mb-4">Financial and environmental impact summary</p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-emerald-950">₹72,400 Cost Savings YTD</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">
                    Zero emergency surge price premiums (₹2,400 vs ₹1,800 standard)
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sky-950">142,000 Litres Conserved</div>
                  <div className="text-[11px] text-sky-700 mt-0.5">
                    Automated pump cutoffs prevent overhead overflow and sump aeration losses.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Audit verified by Green Valley Apartment Residents Welfare Association (RWA).
          </div>
        </div>
      </div>
    </div>
  );
};
