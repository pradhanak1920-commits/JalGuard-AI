import React from 'react';
import {
  Truck,
  Sparkles,
  ShieldCheck,
  Clock,
  IndianRupee,
  CheckCircle2,
  Phone,
  Info,
  TrendingUp,
} from 'lucide-react';
import { useWater } from '../../context/WaterContext';
import { Supplier } from '../../types';

export const SuppliersView: React.FC = () => {
  const { suppliers, openBookingModal } = useWater();

  const recommendedSupplier = suppliers.find((s) => s.isAiRecommended) || suppliers[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Water Tanker Suppliers
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Verified vendor network for Green Valley Apartments with on-time delivery benchmarks.
          </p>
        </div>

        <button
          onClick={() => openBookingModal(recommendedSupplier)}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm shadow-sky-600/30 transition-all flex items-center gap-1.5"
        >
          <Truck className="w-4 h-4" />
          Quick Order Tanker
        </button>
      </div>

      {/* AI Supplier Recommendation Highlight Card */}
      <div className="bg-gradient-to-r from-sky-50 via-white to-blue-50/50 border border-sky-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-600 text-white text-[11px] font-bold tracking-wide flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI Procurement Intelligence
              </span>
              <span className="text-xs font-bold text-sky-950">
                Optimal Vendor Selection
              </span>
            </div>

            <div className="text-base sm:text-lg font-bold text-slate-900">
              Recommended supplier: <span className="text-sky-700 font-extrabold">{recommendedSupplier.name}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              "{recommendedSupplier.aiRecommendationReason}"
            </p>
          </div>

          <button
            onClick={() => openBookingModal(recommendedSupplier)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-600/20 transition-all shrink-0"
          >
            Dispatch with {recommendedSupplier.name}
          </button>
        </div>
      </div>

      {/* Suppliers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {suppliers.map((s) => {
          const isRecommended = s.isAiRecommended;

          return (
            <div
              key={s.id}
              className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all hover:shadow-md ${
                isRecommended
                  ? 'border-sky-500 ring-2 ring-sky-100 shadow-xs'
                  : 'border-slate-200/80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{s.name}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{s.contactNumber}</span>
                    </div>
                  </div>

                  {isRecommended && (
                    <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-extrabold">
                      AI PICK
                    </span>
                  )}
                </div>

                {/* Price tag */}
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-400">Rate per Tanker</div>
                  <div className="text-xl font-extrabold text-slate-900 tabular-nums">
                    ₹{s.pricePerTankerInr.toLocaleString()}
                    <span className="text-xs font-normal text-slate-500 ml-1">
                      / {(s.tankerCapacityLiters / 1000).toFixed(0)}kL
                    </span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>On-time Delivery:</span>
                    <strong className="text-emerald-700 font-bold tabular-nums">
                      {s.onTimeDeliveryRate}%
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Average Delivery:</span>
                    <strong className="text-slate-800 font-medium tabular-nums">
                      {s.avgDeliveryTimeMinutes} mins
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Reliability Index:</span>
                    <span
                      className={`font-semibold ${
                        s.reliability === 'High'
                          ? 'text-emerald-700'
                          : s.reliability === 'Medium'
                          ? 'text-amber-700'
                          : 'text-slate-600'
                      }`}
                    >
                      {s.reliability}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => openBookingModal(s)}
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isRecommended
                      ? 'bg-sky-600 text-white hover:bg-sky-700 shadow-xs'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  Book Tanker
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900">Supplier Performance Scorecard</h3>
          <p className="text-xs text-slate-500">Historical delivery compliance and dispute rates</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Vendor Name</th>
                <th className="px-5 py-3">Pricing (12,000 L)</th>
                <th className="px-5 py-3">Punctuality Score</th>
                <th className="px-5 py-3">Avg Response Time</th>
                <th className="px-5 py-3">Quality Check</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                    <span>{s.name}</span>
                    {s.isAiRecommended && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-700">
                        Top Choice
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-extrabold text-slate-900 tabular-nums">
                    ₹{s.pricePerTankerInr.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${s.onTimeDeliveryRate}%` }}
                        />
                      </div>
                      <span className="font-mono text-emerald-700 font-bold">{s.onTimeDeliveryRate}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 tabular-nums text-slate-600">
                    ~{s.avgDeliveryTimeMinutes} mins
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> TDS &lt; 350 ppm
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => openBookingModal(s)}
                      className="text-xs text-sky-600 hover:text-sky-800 font-semibold"
                    >
                      Book Now →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Disclaimer note */}
        <div className="p-4 bg-slate-50/60 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>
            Supplier scores and turnaround times are simulation benchmark values for demo purposes.
          </span>
        </div>
      </div>
    </div>
  );
};
