import React from 'react';
import { X, Sparkles, AlertTriangle, ShieldCheck, Database, CloudSun, Users, Gauge } from 'lucide-react';
import { ProcurementRecommendation } from '../../types';
import { useWater } from '../../context/WaterContext';

export const WhyModal: React.FC = () => {
  const { whyModalItem, closeWhyModal, approveRecommendation, settings, tanks } = useWater();

  if (!whyModalItem) return null;

  const underground = tanks.find((t) => t.id === 'tank-underground') || tanks[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-sky-50 via-white to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">Explainable AI Breakdown</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  {whyModalItem.riskTrigger} RISK
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Transparent rationale behind recommendation #{whyModalItem.id}
              </p>
            </div>
          </div>
          <button
            onClick={closeWhyModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Core Determination
            </div>
            <p className="text-sm font-medium text-slate-900 leading-relaxed">
              "{whyModalItem.reason}"
            </p>
          </div>

          {/* 4 Algorithmic Factor Cards */}
          <div>
            <div className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <span>Predictive Decision Weights</span>
              <span className="text-slate-400 font-normal text-xs">(Grounded in live telemetry)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Factor 1 */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition-colors">
                <div className="flex items-center gap-2 text-sky-700 mb-1.5">
                  <Database className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-semibold">Inventory vs Safety Reserve</span>
                </div>
                <div className="text-xs text-slate-600">
                  Current storage is <strong className="text-slate-900">{underground.currentLiters.toLocaleString()} L</strong>.
                  With baseline outflow, water will breach the{' '}
                  <strong className="text-rose-600">{settings.minimumSafetyReserveLiters.toLocaleString()} L</strong> critical buffer
                  in <strong className="text-slate-900">43.2 hours</strong>.
                </div>
              </div>

              {/* Factor 2 */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition-colors">
                <div className="flex items-center gap-2 text-emerald-700 mb-1.5">
                  <Gauge className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold">Municipal Supply Deficit</span>
                </div>
                <div className="text-xs text-slate-600">
                  BWSSB scheduled feeder line pressure is down by <strong className="text-slate-900">18%</strong> for the
                  Thursday slot, creating a <strong className="text-slate-900">16,000 L</strong> inflow deficit.
                </div>
              </div>

              {/* Factor 3 */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition-colors">
                <div className="flex items-center gap-2 text-amber-700 mb-1.5">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-semibold">Resident Occupancy Surge</span>
                </div>
                <div className="text-xs text-slate-600">
                  {settings.residentsCount} residents across {settings.apartmentsCount} flats are currently averaging{' '}
                  <strong className="text-slate-900">+8.2%</strong> above the 30-day baseline due to weekend laundry cycles.
                </div>
              </div>

              {/* Factor 4 */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition-colors">
                <div className="flex items-center gap-2 text-purple-700 mb-1.5">
                  <CloudSun className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-semibold">Weather & Borewell Yield</span>
                </div>
                <div className="text-xs text-slate-600">
                  Afternoon temperatures forecast at <strong className="text-slate-900">32°C</strong>. Borewell output is
                  stable at 3,200 L/h, but cannot compensate for peak morning residential draw alone.
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation Action Recap */}
          <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-sky-950">Recommended Tanker Procurement</div>
              <div className="text-sm font-semibold text-sky-900">
                {whyModalItem.recommendedQuantityLiters.toLocaleString()} L from {whyModalItem.supplierName}
              </div>
              <div className="text-xs text-sky-700 mt-0.5">
                Target delivery: {whyModalItem.recommendedDate} · {whyModalItem.recommendedTimeWindow} (₹{whyModalItem.estimatedCostInr})
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={closeWhyModal}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
          {whyModalItem.status === 'PENDING' && (
            <button
              onClick={() => {
                approveRecommendation(whyModalItem.id);
                closeWhyModal();
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm shadow-sky-600/30 transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              Approve Order Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
