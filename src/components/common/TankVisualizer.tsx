import React from 'react';
import { Droplet, ArrowDownRight, ArrowUpRight, AlertCircle, ShieldAlert } from 'lucide-react';
import { TankData } from '../../types';

interface TankVisualizerProps {
  tank: TankData;
  safetyReserveLiters?: number;
  compact?: boolean;
  showDetails?: boolean;
}

export const TankVisualizer: React.FC<TankVisualizerProps> = ({
  tank,
  safetyReserveLiters = 20000,
  compact = false,
  showDetails = true,
}) => {
  const percentage = Math.min(100, Math.max(0, tank.percentage));
  const isWarning = percentage <= 40 && percentage > 20;
  const isCritical = percentage <= 20;

  // Water level color
  const liquidBg = isCritical
    ? 'from-rose-500 to-rose-600'
    : isWarning
    ? 'from-amber-500 to-amber-600'
    : 'from-sky-400 via-sky-500 to-blue-600';

  const liquidBorder = isCritical ? 'border-rose-400' : isWarning ? 'border-amber-400' : 'border-sky-300';

  const safetyReservePct = Math.round((safetyReserveLiters / tank.capacityLiters) * 100);

  return (
    <div className={`flex flex-col ${compact ? 'gap-3' : 'gap-4'} w-full`}>
      {/* Visual Tank Vessel */}
      <div className="relative w-full bg-slate-100 rounded-2xl p-4 border border-slate-200/80 shadow-inner overflow-hidden">
        {/* Tank Vessel Frame */}
        <div
          className={`relative w-full ${
            compact ? 'h-44' : 'h-64'
          } rounded-xl bg-slate-900/5 border-2 border-slate-300/80 overflow-hidden flex flex-col justify-end backdrop-blur-xs`}
        >
          {/* Depth Ruler / Grid lines */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 z-10 opacity-60">
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span className="border-t border-slate-400 w-3" />
              <span>100% · {(tank.capacityLiters / 1000).toFixed(0)}kL</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span className="border-t border-slate-400 w-3" />
              <span>75% · {((tank.capacityLiters * 0.75) / 1000).toFixed(0)}kL</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span className="border-t border-slate-400 w-3" />
              <span>50% · {((tank.capacityLiters * 0.5) / 1000).toFixed(0)}kL</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span className="border-t border-slate-400 w-3" />
              <span>25% · {((tank.capacityLiters * 0.25) / 1000).toFixed(0)}kL</span>
            </div>
          </div>

          {/* Safety Reserve Threshold Line */}
          {safetyReservePct > 0 && (
            <div
              className="absolute left-0 right-0 z-20 pointer-events-none border-b-2 border-dashed border-rose-500 flex items-center justify-between px-2"
              style={{ bottom: `${safetyReservePct}%` }}
            >
              <span className="text-[10px] font-bold text-rose-600 bg-white/90 px-1 py-0.5 rounded shadow-xs">
                Safety Reserve: {(safetyReserveLiters / 1000).toFixed(0)}kL
              </span>
              <span className="text-[10px] font-semibold text-rose-500 font-mono">{safetyReservePct}%</span>
            </div>
          )}

          {/* Liquid Body */}
          <div
            className={`w-full bg-gradient-to-t ${liquidBg} transition-all duration-700 ease-out relative overflow-hidden`}
            style={{ height: `${percentage}%` }}
          >
            {/* Animated Surface Ripple */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-white/30 backdrop-blur-xs border-t-2 border-white/60 animate-pulse" />
            
            {/* Gloss Highlight Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-transparent to-black/10 pointer-events-none" />

            {/* Bubble particles */}
            <div className="absolute bottom-2 left-6 w-1.5 h-1.5 rounded-full bg-white/40 animate-ping" />
            <div className="absolute bottom-6 right-10 w-2 h-2 rounded-full bg-white/30 animate-pulse" />
          </div>

          {/* Centered Large Percentage & Volume Callout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
            <div className="bg-slate-900/75 backdrop-blur-md px-4 py-2 rounded-xl text-center shadow-lg border border-white/20">
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums">
                {percentage}%
              </div>
              <div className="text-xs font-semibold text-sky-200 tabular-nums">
                {tank.currentLiters.toLocaleString()} / {tank.capacityLiters.toLocaleString()} L
              </div>
            </div>
          </div>
        </div>

        {/* Live Status Row */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <span
              className={`w-2 h-2 rounded-full ${
                isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
            <span className="font-semibold text-slate-800">
              {isCritical ? 'Critical Level' : isWarning ? 'Warning Buffer' : 'Healthy Level'}
            </span>
          </div>

          <div className="text-slate-500 font-medium text-[11px] tabular-nums">
            Depth: {tank.depthMeters}m / {tank.maxDepthMeters}m
          </div>
        </div>
      </div>

      {/* Inflow/Outflow Metrics */}
      {showDetails && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600" />
              <span>Inflow Rate</span>
            </div>
            <div className="font-bold text-slate-800 tabular-nums">
              +{tank.inflowRateLitersPerHour.toLocaleString()} L/h
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Municipal + Borewell</div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
              <span>Outflow Rate</span>
            </div>
            <div className="font-bold text-slate-800 tabular-nums">
              -{tank.outflowRateLitersPerHour.toLocaleString()} L/h
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Domestic Supply (200 flats)</div>
          </div>
        </div>
      )}
    </div>
  );
};
