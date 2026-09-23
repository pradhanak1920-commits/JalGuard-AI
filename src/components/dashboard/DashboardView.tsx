import React from 'react';
import {
  Droplets,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
  Activity,
  Layers,
  Truck,
} from 'lucide-react';
import { useWater } from '../../context/WaterContext';
import { TankVisualizer } from '../common/TankVisualizer';

export const DashboardView: React.FC = () => {
  const {
    tanks,
    settings,
    recommendations,
    approveRecommendation,
    openWhyModal,
    setActiveTab,
    openBookingModal,
    suppliers,
  } = useWater();

  const underground = tanks.find((t) => t.id === 'tank-underground') || tanks[0];
  const pendingRec = recommendations.find((r) => r.status === 'PENDING') || recommendations[0];

  const primarySupplier = suppliers[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Good morning, Ravi 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here is your water operations overview for <strong className="text-slate-700">{settings.propertyName}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulator')}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Run What-If Simulation
          </button>
          <button
            onClick={() => openBookingModal(primarySupplier)}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm shadow-sky-600/30 transition-all flex items-center gap-1.5"
          >
            <Truck className="w-3.5 h-3.5" />
            Order Tanker
          </button>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Water Available */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Water Available</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {underground.currentLiters.toLocaleString()} L
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="text-sky-600 font-semibold flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              63% capacity
            </span>
            <span className="text-slate-300">·</span>
            <span>Total 150kL</span>
          </div>
        </div>

        {/* KPI 2: Today's Consumption */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Today's Consumption</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
            81,000 L
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="text-amber-600 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +2.1%
            </span>
            <span>vs 30d baseline</span>
          </div>
        </div>

        {/* KPI 3: Shortage Risk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Shortage Risk</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-600 tracking-tight flex items-center gap-2">
            HIGH
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div className="mt-2 text-xs text-rose-600/90 font-medium">
            Projected deficit Thursday 6 AM
          </div>
        </div>

        {/* KPI 4: Days of Water Remaining */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Days Remaining</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
            1.8 days
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">~43.2 hours</span>
            <span>at current outflow rate</span>
          </div>
        </div>
      </div>

      {/* Primary Section: AI Risk Alert Card */}
      <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50/90 via-white to-amber-50/50 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-bold tracking-wide">
                RISK: HIGH
              </span>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                AI Shortage Prediction
              </span>
            </div>

            <p className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
              "Based on current consumption, expected municipal supply and borewell output, the property may experience a water shortage by Thursday at 6:00 AM."
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-700 pt-1">
              <span className="font-semibold text-slate-900">Recommended Action:</span>
              <span className="bg-white/80 px-2 py-0.5 rounded-md border border-rose-200 font-medium">
                Arrange a 12,000 L tanker before Wednesday 10:00 AM.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (pendingRec) approveRecommendation(pendingRec.id);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve Recommendation
            </button>
            <button
              onClick={() => {
                if (pendingRec) openWhyModal(pendingRec);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-colors"
            >
              View Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Water Level Card + AI Procurement Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large Visual Tank Indicator (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Underground Water Sump</h3>
                <p className="text-xs text-slate-500">Live ultrasonic depth & capacitive sensor</p>
              </div>
              <span className="text-[11px] font-medium text-slate-400">
                Last updated {underground.lastUpdatedMinutesAgo} min ago
              </span>
            </div>

            <TankVisualizer tank={underground} safetyReserveLiters={settings.minimumSafetyReserveLiters} />
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Overhead Tank: <strong className="text-slate-800">27,000 L (68%)</strong>
            </div>
            <button
              onClick={() => setActiveTab('tanks')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1"
            >
              <span>View Tank Monitor</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* AI Recommendations & Water Inflow Sources (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* AI Procurement Recommendations Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-base text-slate-900">AI Procurement Recommendations</h3>
              </div>
              <button
                onClick={() => setActiveTab('recommendations')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-800"
              >
                View all ({recommendations.length}) →
              </button>
            </div>

            <div className="space-y-3">
              {recommendations.slice(0, 2).map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{rec.category}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-rose-100 text-rose-700">
                          {rec.riskTrigger}
                        </span>
                        {rec.status === 'APPROVED' && (
                          <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-700">
                            Approved
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-slate-600">
                        Recommended: <strong className="text-slate-900">{rec.recommendedQuantityLiters.toLocaleString()} L</strong> · {rec.recommendedDate} ({rec.recommendedTimeWindow})
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-semibold text-slate-500">Estimated Cost</div>
                      <div className="text-sm font-extrabold text-slate-900 tabular-nums">
                        ₹{rec.estimatedCostInr.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-500 leading-relaxed italic">
                    "{rec.reason}"
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <button
                      onClick={() => openWhyModal(rec)}
                      className="text-xs text-slate-600 hover:text-sky-700 font-medium flex items-center gap-1 transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                      <span>Why am I seeing this?</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">Supplier: <strong>{rec.supplierName}</strong></span>
                      {rec.status === 'PENDING' ? (
                        <button
                          onClick={() => approveRecommendation(rec.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-colors shadow-xs"
                        >
                          Approve Order
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Scheduled
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Water Supply Distribution Matrix */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-3">Live Water Sources & Inflow Rates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 font-medium">BWSSB Municipal Supply</div>
                <div className="text-base font-bold text-slate-900 mt-1 tabular-nums">1,400 L/h</div>
                <div className="text-[10px] text-amber-600 font-semibold mt-0.5">Deficit: -18% vs normal</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 font-medium">Borewell #1 & #2 Yield</div>
                <div className="text-base font-bold text-slate-900 mt-1 tabular-nums">1,000 L/h</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Stable output</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 font-medium">Daily Outflow (Residents)</div>
                <div className="text-base font-bold text-slate-900 mt-1 tabular-nums">3,450 L/h</div>
                <div className="text-[10px] text-rose-500 font-semibold mt-0.5">Draw exceeds net inflow</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
