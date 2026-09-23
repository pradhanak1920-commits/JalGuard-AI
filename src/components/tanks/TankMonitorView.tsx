import React, { useState } from 'react';
import {
  Layers,
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  Radio,
  Power,
  RefreshCw,
  Sparkles,
  Gauge,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { useWater } from '../../context/WaterContext';
import { TankVisualizer } from '../common/TankVisualizer';

export const TankMonitorView: React.FC = () => {
  const {
    tanks,
    settings,
    liveUpdatesEnabled,
    setLiveUpdatesEnabled,
    pumpBoosterActive,
    togglePumpBooster,
    setActiveTab,
  } = useWater();

  const [selectedTimeline, setSelectedTimeline] = useState<'24h' | '7d'>('24h');

  const underground = tanks.find((t) => t.id === 'tank-underground') || tanks[0];
  const overhead = tanks.find((t) => t.id === 'tank-overhead') || tanks[1];

  // 24h history levels for visualization
  const historyPoints = [
    { time: '00:00', underground: 108000, overhead: 31000 },
    { time: '03:00', underground: 106000, overhead: 30500 },
    { time: '06:00', underground: 101000, overhead: 28000 },
    { time: '09:00', underground: 96000, overhead: 26500 },
    { time: '12:00', underground: 95500, overhead: 27200 },
    { time: '15:00', underground: 94800, overhead: 27000 },
    { time: '18:00', underground: 94200, overhead: 26800 },
    { time: 'Now', underground: underground.currentLiters, overhead: overhead.currentLiters },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Live Tank Telemetry & Sump Monitoring
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                liveUpdatesEnabled
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Radio className={`w-3 h-3 ${liveUpdatesEnabled ? 'animate-pulse text-emerald-600' : ''}`} />
              {liveUpdatesEnabled ? 'Real-time telemetry active' : 'Live stream paused'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Dual reservoir tracking with hydrostatic level sensors and automated booster pump staging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLiveUpdatesEnabled(!liveUpdatesEnabled)}
            className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${liveUpdatesEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
            {liveUpdatesEnabled ? 'Pause Sensors' : 'Resume Sensors'}
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm shadow-sky-600/30 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Simulate Tanker Discharge
          </button>
        </div>
      </div>

      {/* Side-by-Side Vertical Tank Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tank 1: Underground Tank */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Primary Storage
                </span>
                <h3 className="font-bold text-lg text-slate-900 mt-0.5">Underground Sump Tank</h3>
                <p className="text-xs text-slate-500">Receives BWSSB piped mains + Borewell yield</p>
              </div>
              <span className="text-[11px] font-medium text-slate-400">
                Updated {underground.lastUpdatedMinutesAgo}m ago
              </span>
            </div>

            <TankVisualizer tank={underground} safetyReserveLiters={settings.minimumSafetyReserveLiters} />
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Estimated Depletion Time:</span>
              <strong className="text-rose-600 font-bold">{underground.hoursRemaining} hours</strong>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Sensor Protocol:</span>
              <span className="font-mono text-slate-700">Ultrasonic Transducer · RS485 (Online)</span>
            </div>
          </div>
        </div>

        {/* Tank 2: Overhead Tank */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Rooftop Gravity Header
                </span>
                <h3 className="font-bold text-lg text-slate-900 mt-0.5">Overhead Distribution Tank</h3>
                <p className="text-xs text-slate-500">Gravity feed to all 200 residential apartment fixtures</p>
              </div>
              <span className="text-[11px] font-medium text-slate-400">
                Updated {overhead.lastUpdatedMinutesAgo}m ago
              </span>
            </div>

            <TankVisualizer tank={overhead} safetyReserveLiters={8000} />
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Estimated Depletion Time:</span>
              <strong className="text-amber-600 font-bold">{overhead.hoursRemaining} hours</strong>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Sensor Protocol:</span>
              <span className="font-mono text-slate-700">Hydrostatic Pressure Sensor · LoRaWAN (Online)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booster Pump & Intersump Transfer Console */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                pumpBoosterActive ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'bg-slate-200 text-slate-600'
              }`}
            >
              <Power className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900">Booster Pump Transfer Subsystem</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    pumpBoosterActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {pumpBoosterActive ? 'PUMP RUNNING' : 'STANDBY'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pumps water from Underground Sump (94kL) up to Overhead Tanks (27kL) at 3,450 L/hr.
              </p>
            </div>
          </div>

          <button
            onClick={togglePumpBooster}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              pumpBoosterActive
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/30'
            }`}
          >
            <Power className="w-4 h-4" />
            {pumpBoosterActive ? 'Stop Booster Pump' : 'Start Booster Pump'}
          </button>
        </div>
      </div>

      {/* Historical 24-Hour Tank Level Timeline Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-bold text-base text-slate-900">Historical 24-Hour Storage Levels</h3>
            <p className="text-xs text-slate-500">Hourly volume draw down vs municipal filling cycles</p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 rounded-full bg-sky-600" />
              <span className="text-slate-700">Underground Sump</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 rounded-full bg-blue-400" />
              <span className="text-slate-700">Overhead Tank</span>
            </div>
          </div>
        </div>

        {/* 24h Bar Chart Visualization */}
        <div className="grid grid-cols-8 gap-2 items-end h-48 pt-6 pb-2 border-b border-slate-200 px-2">
          {historyPoints.map((pt, idx) => {
            const underHeight = Math.round((pt.underground / 150000) * 100);
            const overHeight = Math.round((pt.overhead / 40000) * 100);

            return (
              <div key={pt.time} className="flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full max-w-[42px] flex items-end justify-center gap-1 h-full">
                  {/* Underground bar */}
                  <div
                    className="w-1/2 bg-sky-600 rounded-t-sm transition-all duration-300 hover:bg-sky-500 relative"
                    style={{ height: `${underHeight}%` }}
                    title={`Underground: ${pt.underground.toLocaleString()} L`}
                  />
                  {/* Overhead bar */}
                  <div
                    className="w-1/2 bg-blue-400 rounded-t-sm transition-all duration-300 hover:bg-blue-300 relative"
                    style={{ height: `${overHeight}%` }}
                    title={`Overhead: ${pt.overhead.toLocaleString()} L`}
                  />
                </div>
                <span className="text-[10px] font-semibold text-slate-500">{pt.time}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>00:00 Night Baseline: 108,000 L</span>
          <span>Current Combined Inventory: {(underground.currentLiters + overhead.currentLiters).toLocaleString()} L</span>
        </div>
      </div>
    </div>
  );
};
