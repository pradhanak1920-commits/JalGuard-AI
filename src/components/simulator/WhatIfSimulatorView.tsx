import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Clock,
  IndianRupee,
  ShieldCheck,
  RefreshCw,
  Droplets,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { useWater } from '../../context/WaterContext';
import { WHAT_IF_PRESETS } from '../../data/mockData';
import { SimulationResult, RiskLevel } from '../../types';

export const WhatIfSimulatorView: React.FC = () => {
  const { tanks, settings, applySimulationRecommendation } = useWater();
  const underground = tanks.find((t) => t.id === 'tank-underground') || tanks[0];

  // Simulator controls state
  const [selectedPresetId, setSelectedPresetId] = useState<string>('sc-1');
  const [municipalSupplyPct, setMunicipalSupplyPct] = useState<number>(0);
  const [consumptionChangePct, setConsumptionChangePct] = useState<number>(0);
  const [heatwaveOffset, setHeatwaveOffset] = useState<number>(0);
  const [tankerDelayHours, setTankerDelayHours] = useState<number>(0);

  // Apply a preset
  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = WHAT_IF_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setMunicipalSupplyPct(preset.municipalSupplyPct);
      setConsumptionChangePct(preset.consumptionChangePct);
      setHeatwaveOffset(preset.heatwaveTempOffset);
      setTankerDelayHours(preset.tankerDelayHours);
    }
  };

  // Dynamic simulation calculations
  const simulation: SimulationResult = useMemo(() => {
    const currentWater = underground.currentLiters;
    const baseDailyConsumption = settings.dailyExpectedConsumptionLiters; // 82,000 L

    // Heat factor: +3% demand per °C above normal
    const tempImpactPct = heatwaveOffset > 0 ? heatwaveOffset * 3.2 : heatwaveOffset * 1.5;
    const totalConsumptionMultiplier = 1 + (consumptionChangePct + tempImpactPct) / 100;
    const expectedConsumption = Math.round(baseDailyConsumption * totalConsumptionMultiplier);

    // Inflow: Normal municipal is ~33,600 L/day (1,400 L/h * 24)
    // Borewell is ~24,000 L/day (1,000 L/h * 24)
    const normalMunicipal = 33600;
    const actualMunicipal = Math.round(normalMunicipal * (municipalSupplyPct / 100));
    const borewellInflow = 24000;
    const expectedInflow = actualMunicipal + borewellInflow;

    const safetyReserve = settings.minimumSafetyReserveLiters; // 20,000 L

    // Net balance after 24h
    const projectedNetBalance = currentWater + expectedInflow - expectedConsumption;
    
    // Shortage is how much we dip below safety reserve
    const deficitBelowReserve = safetyReserve - projectedNetBalance;
    const projectedShortage = deficitBelowReserve > 0 ? deficitBelowReserve : 0;

    // Rate of depletion per hour
    const netHourlyDrain = (expectedConsumption - expectedInflow) / 24;
    let hoursUntilShortage = 48;
    if (netHourlyDrain > 0) {
      const usableWaterBeforeReserve = currentWater - safetyReserve;
      hoursUntilShortage = Number((usableWaterBeforeReserve / netHourlyDrain).toFixed(1));
      if (hoursUntilShortage < 0) hoursUntilShortage = 0;
    }

    // Risk categorization
    let riskLevel: RiskLevel = 'LOW';
    if (projectedShortage > 15000 || hoursUntilShortage < 12) {
      riskLevel = 'CRITICAL';
    } else if (projectedShortage > 5000 || hoursUntilShortage < 24) {
      riskLevel = 'HIGH';
    } else if (projectedShortage > 0 || hoursUntilShortage < 36) {
      riskLevel = 'MODERATE';
    }

    // Recommended tankers (each 12,000 L)
    const recommendedTankers = projectedShortage > 0 ? Math.ceil(projectedShortage / 12000) : 0;
    const estimatedCost = recommendedTankers * 1800;

    const activePreset = WHAT_IF_PRESETS.find((p) => p.id === selectedPresetId);
    const scenarioTitle = activePreset ? activePreset.title : 'Custom Scenario';

    let recommendationText = 'Water reserves adequate. Continue normal monitoring.';
    if (recommendedTankers > 0) {
      recommendationText = `Order ${recommendedTankers} tanker${
        recommendedTankers > 1 ? 's' : ''
      } (${(recommendedTankers * 12000).toLocaleString()} L) before ${
        hoursUntilShortage < 18 ? '10:00 AM tomorrow' : 'Thursday morning'
      } to maintain ${safetyReserve.toLocaleString()} L safety reserve.`;
    }

    let shortageTimeDescription = 'Safe for >48 hours';
    if (hoursUntilShortage <= 24) {
      shortageTimeDescription = `Shortage expected in ~${hoursUntilShortage} hours (Tomorrow ~${Math.round(hoursUntilShortage + 6)}:00 AM)`;
    } else if (hoursUntilShortage <= 36) {
      shortageTimeDescription = `Reserve breaches in ~${hoursUntilShortage} hours`;
    }

    return {
      scenarioTitle,
      currentWaterLiters: currentWater,
      expectedConsumptionLiters: expectedConsumption,
      expectedInflowLiters: expectedInflow,
      safetyReserveLiters: safetyReserve,
      projectedNetBalanceLiters: projectedNetBalance,
      projectedShortageLiters: projectedShortage,
      hoursUntilShortage,
      shortageTimeDescription,
      riskLevel,
      aiRecommendation: recommendationText,
      recommendedTankers: recommendedTankers || 1,
      estimatedAdditionalCostInr: estimatedCost || 1800,
    };
  }, [
    underground.currentLiters,
    settings,
    selectedPresetId,
    municipalSupplyPct,
    consumptionChangePct,
    heatwaveOffset,
    tankerDelayHours,
  ]);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            What-If AI Simulator
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Predictive Stress Test Engine
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Simulate possible events before they become water shortages.
        </p>
      </div>

      {/* Preset Scenario Buttons */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Preset Disaster & Surge Scenarios
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {WHAT_IF_PRESETS.map((preset, index) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-sky-600 bg-sky-50/60 ring-2 ring-sky-600/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-sky-700">Scenario {index + 1}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-sky-600" />}
                </div>
                <div className="font-bold text-xs text-slate-900 mt-1 leading-snug">
                  "{preset.title}"
                </div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {preset.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fine-Tuning Sliders Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-sky-600" />
          <span>Interactive Variable Controls</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          {/* Slider 1: Municipal Supply */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-semibold text-slate-700">
              <span>Municipal Inflow</span>
              <span className="font-mono text-sky-700">{municipalSupplyPct}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={150}
              step={10}
              value={municipalSupplyPct}
              onChange={(e) => {
                setSelectedPresetId('custom');
                setMunicipalSupplyPct(Number(e.target.value));
              }}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% (Pipeline Shut)</span>
              <span>100% (Normal)</span>
              <span>150%</span>
            </div>
          </div>

          {/* Slider 2: Resident Consumption */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-semibold text-slate-700">
              <span>Resident Consumption</span>
              <span className="font-mono text-sky-700">
                {consumptionChangePct >= 0 ? `+${consumptionChangePct}%` : `${consumptionChangePct}%`}
              </span>
            </div>
            <input
              type="range"
              min={-30}
              max={50}
              step={5}
              value={consumptionChangePct}
              onChange={(e) => {
                setSelectedPresetId('custom');
                setConsumptionChangePct(Number(e.target.value));
              }}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-30%</span>
              <span>0% Baseline</span>
              <span>+50% (Peak Surge)</span>
            </div>
          </div>

          {/* Slider 3: Temperature Offset */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-semibold text-slate-700">
              <span>Heatwave Offset</span>
              <span className="font-mono text-sky-700">
                {heatwaveOffset >= 0 ? `+${heatwaveOffset}°C` : `${heatwaveOffset}°C`}
              </span>
            </div>
            <input
              type="range"
              min={-4}
              max={8}
              step={1}
              value={heatwaveOffset}
              onChange={(e) => {
                setSelectedPresetId('custom');
                setHeatwaveOffset(Number(e.target.value));
              }}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-4°C (Rain)</span>
              <span>0°C</span>
              <span>+8°C (Heatwave)</span>
            </div>
          </div>

          {/* Slider 4: Tanker Delay */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-semibold text-slate-700">
              <span>Tanker Traffic Delay</span>
              <span className="font-mono text-sky-700">{tankerDelayHours} hrs</span>
            </div>
            <input
              type="range"
              min={0}
              max={12}
              step={1}
              value={tankerDelayHours}
              onChange={(e) => {
                setSelectedPresetId('custom');
                setTankerDelayHours(Number(e.target.value));
              }}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0h (On Time)</span>
              <span>6h</span>
              <span>12h Gridlock</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Simulation Results Panel */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-5">
          <div>
            <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              AI Simulation Output & Shortage Projection
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              {simulation.scenarioTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Simulated Risk Level
              </div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold tracking-wide ${
                  simulation.riskLevel === 'CRITICAL'
                    ? 'bg-rose-500 text-white'
                    : simulation.riskLevel === 'HIGH'
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : simulation.riskLevel === 'MODERATE'
                    ? 'bg-yellow-400 text-slate-950 font-black'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                {simulation.riskLevel}
              </span>
            </div>
          </div>
        </div>

        {/* 5 Core Simulation Metric Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="text-slate-400 font-medium">Current Water</div>
            <div className="text-lg font-bold text-white mt-1 tabular-nums">
              {simulation.currentWaterLiters.toLocaleString()} L
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Starting baseline</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="text-slate-400 font-medium">Expected Consumption</div>
            <div className="text-lg font-bold text-amber-300 mt-1 tabular-nums">
              {simulation.expectedConsumptionLiters.toLocaleString()} L
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">24-hour demand</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="text-slate-400 font-medium">Expected Inflow</div>
            <div className="text-lg font-bold text-sky-300 mt-1 tabular-nums">
              {simulation.expectedInflowLiters.toLocaleString()} L
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">BWSSB + Borewell</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="text-slate-400 font-medium">Safety Reserve</div>
            <div className="text-lg font-bold text-slate-300 mt-1 tabular-nums">
              {simulation.safetyReserveLiters.toLocaleString()} L
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Minimum buffer</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 col-span-2 sm:col-span-1">
            <div className="text-slate-400 font-medium">Projected Shortage</div>
            <div
              className={`text-lg font-extrabold mt-1 tabular-nums ${
                simulation.projectedShortageLiters > 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {simulation.projectedShortageLiters > 0
                ? `${simulation.projectedShortageLiters.toLocaleString()} L`
                : 'No Deficit'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Buffer breach volume</div>
          </div>
        </div>

        {/* AI Recommendation Banner & Apply Button */}
        <div className="p-5 rounded-xl bg-sky-950/70 border border-sky-600/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>JalGuard AI Procurement Prescription</span>
            </div>
            <p className="text-base font-semibold text-white">
              "{simulation.aiRecommendation}"
            </p>
            <div className="flex items-center gap-3 text-xs text-sky-200/80 pt-1">
              <span>
                Estimated Additional Cost: <strong>₹{simulation.estimatedAdditionalCostInr.toLocaleString()}</strong>
              </span>
              <span>·</span>
              <span>
                Depletion Horizon: <strong>{simulation.shortageTimeDescription}</strong>
              </span>
            </div>
          </div>

          <button
            onClick={() => applySimulationRecommendation(simulation)}
            className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-sky-500 hover:bg-sky-400 shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <span>Apply Recommendation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
