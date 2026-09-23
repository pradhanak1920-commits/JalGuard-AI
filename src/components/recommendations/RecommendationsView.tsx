import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Truck,
  IndianRupee,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Filter,
  Plus,
} from 'lucide-react';
import { useWater } from '../../context/WaterContext';

export const RecommendationsView: React.FC = () => {
  const {
    recommendations,
    approveRecommendation,
    openWhyModal,
    openBookingModal,
    suppliers,
  } = useWater();

  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');

  const filtered = recommendations.filter((rec) => {
    if (filter === 'PENDING') return rec.status === 'PENDING';
    if (filter === 'APPROVED') return rec.status === 'APPROVED';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              AI Procurement Recommendations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              Autonomous Optimization
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Data-driven procurement schedules to eliminate dry taps and minimize emergency spot tanker rates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openBookingModal(suppliers[0])}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm shadow-sky-600/30 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Manual Order
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filter === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Recommendations ({recommendations.length})
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filter === 'PENDING' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Action Required ({recommendations.filter((r) => r.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setFilter('APPROVED')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filter === 'APPROVED' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Approved Orders ({recommendations.filter((r) => r.status === 'APPROVED').length})
          </button>
        </div>

        <div className="text-xs text-slate-500 hidden sm:block">
          Auto-evaluating telemetry every 15 minutes
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((rec) => {
          const isPending = rec.status === 'PENDING';

          return (
            <div
              key={rec.id}
              className={`bg-white rounded-2xl border transition-all p-6 flex flex-col justify-between shadow-xs hover:shadow-md ${
                isPending
                  ? 'border-sky-200 ring-1 ring-sky-100'
                  : 'border-slate-200/80 bg-slate-50/40'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {rec.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rec.riskTrigger === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-700'
                            : rec.riskTrigger === 'HIGH'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {rec.riskTrigger} RISK
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900 mt-1 tabular-nums">
                      {rec.recommendedQuantityLiters.toLocaleString()} Litres
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Est. Cost</span>
                    <span className="text-lg font-extrabold text-slate-900 tabular-nums">
                      ₹{rec.estimatedCostInr.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Logistics breakdown details */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Recommended Date</span>
                    <strong className="text-slate-800">{rec.recommendedDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Delivery Slot</span>
                    <strong className="text-slate-800">{rec.recommendedTimeWindow}</strong>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-slate-500">Assigned Supplier:</span>
                    <strong className="text-sky-700">{rec.supplierName}</strong>
                  </div>
                </div>

                {/* AI Reasoning message */}
                <div className="mt-4">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    AI Shortage Rationale:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed italic bg-sky-50/40 p-2.5 rounded-lg border border-sky-100">
                    "{rec.reason}"
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => openWhyModal(rec)}
                  className="text-xs text-slate-600 hover:text-sky-700 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                  <span>Why am I seeing this?</span>
                </button>

                {isPending ? (
                  <button
                    onClick={() => approveRecommendation(rec.id)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm shadow-sky-600/30 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Order
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Order Dispatched ({rec.deliverySlot})
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
