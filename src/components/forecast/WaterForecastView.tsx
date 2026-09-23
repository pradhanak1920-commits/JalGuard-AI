import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Calendar,
  CloudSun,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useWater } from '../../context/WaterContext';

export const WaterForecastView: React.FC = () => {
  const { forecast, settings, setActiveTab } = useWater();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG Chart Dimensions
  const chartWidth = 760;
  const chartHeight = 260;
  const paddingX = 45;
  const paddingY = 30;

  const minVal = 70000;
  const maxVal = 105000;

  const getY = (val: number) => {
    return (
      chartHeight -
      paddingY -
      ((val - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2)
    );
  };

  const getX = (index: number) => {
    return paddingX + (index / (forecast.length - 1)) * (chartWidth - paddingX * 2);
  };

  // Predicted line points
  const predictedPoints = forecast
    .map((f, i) => `${getX(i)},${getY(f.predictedLiters)}`)
    .join(' ');

  // Confidence upper & lower polygon path
  const confidencePath =
    forecast.map((f, i) => `${getX(i)},${getY(f.confidenceUpper)}`).join(' L ') +
    ' L ' +
    [...forecast]
      .reverse()
      .map((f, i) => `${getX(forecast.length - 1 - i)},${getY(f.confidenceLower)}`)
      .join(' L ') +
    ' Z';

  // 7-day sum & metrics
  const total7DayProjected = forecast.reduce((acc, curr) => acc + curr.predictedLiters, 0);
  const avgDaily = Math.round(total7DayProjected / forecast.length);
  const peakDay = [...forecast].sort((a, b) => b.predictedLiters - a.predictedLiters)[0];
  const lowestDay = [...forecast].sort((a, b) => a.predictedLiters - b.predictedLiters)[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              7-Day Water Demand Forecast
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              Forecast Accuracy: 93%
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Machine-learning model accounting for 680 residents, weekend surges, weather heat index, and seasonal draws.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulator')}
            className="px-3 py-2 rounded-lg text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors"
          >
            Simulate Surge
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm shadow-sky-600/30 transition-all"
          >
            Procurement Plan
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Average Daily Consumption</div>
          <div className="text-xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {avgDaily.toLocaleString()} L
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Baseline: 82,000 L / day</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Peak Consumption Day</div>
          <div className="text-xl font-extrabold text-rose-600 mt-1 tabular-nums">
            {peakDay.dayLabel.split(' ')[0]} ({peakDay.predictedLiters.toLocaleString()} L)
          </div>
          <div className="text-[11px] text-rose-500 mt-0.5">+17% Weekend Laundry Surge</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Lowest Consumption Day</div>
          <div className="text-xl font-extrabold text-emerald-600 mt-1 tabular-nums">
            {lowestDay.dayLabel.split(' ')[0]} ({lowestDay.predictedLiters.toLocaleString()} L)
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5">Rain showers forecast</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">7-Day Total Requirement</div>
          <div className="text-xl font-extrabold text-sky-700 mt-1 tabular-nums">
            {total7DayProjected.toLocaleString()} L
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">~{(total7DayProjected / 100000).toFixed(2)} Lakh Litres</div>
        </div>
      </div>

      {/* Primary Forecast Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-bold text-base text-slate-900">Actual vs. AI Predicted Consumption</h3>
            <p className="text-xs text-slate-500">
              Shaded cyan zone represents the 95% Bayesian confidence band
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-700">Actual Metered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-sky-600 border-t-2 border-dashed border-sky-600" />
              <span className="text-slate-700">AI Prediction</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-sky-200/60 border border-sky-300" />
              <span className="text-slate-700">Confidence Band</span>
            </div>
          </div>
        </div>

        {/* SVG Responsive Container */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[640px]">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto overflow-visible select-none"
            >
              {/* Horizontal Grid lines */}
              {[70000, 80000, 90000, 100000].map((val) => (
                <g key={val}>
                  <line
                    x1={paddingX}
                    y1={getY(val)}
                    x2={chartWidth - paddingX}
                    y2={getY(val)}
                    stroke="#E2E8F0"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingX - 10}
                    y={getY(val) + 4}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-mono"
                  >
                    {(val / 1000).toFixed(0)}kL
                  </text>
                </g>
              ))}

              {/* Confidence Band Polygon */}
              <polygon
                points={confidencePath}
                fill="rgba(56, 189, 248, 0.15)"
                stroke="rgba(56, 189, 248, 0.4)"
                strokeWidth="1"
              />

              {/* AI Predicted Line */}
              <polyline
                fill="none"
                stroke="#0284C7"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={predictedPoints}
              />

              {/* Data points and hover anchors */}
              {forecast.map((d, i) => {
                const cx = getX(i);
                const cy = getY(d.predictedLiters);
                const isHovered = hoveredIndex === i;

                return (
                  <g
                    key={d.dayLabel}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="cursor-pointer"
                  >
                    {/* Vertical hover line */}
                    {isHovered && (
                      <line
                        x1={cx}
                        y1={paddingY}
                        x2={cx}
                        y2={chartHeight - paddingY}
                        stroke="#0284C7"
                        strokeDasharray="2 2"
                        strokeWidth="1.5"
                      />
                    )}

                    {/* Predicted Dot */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 6 : 4}
                      fill="#0284C7"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      className="transition-all"
                    />

                    {/* Actual Metered Point (Only for Today) */}
                    {d.actualLiters && (
                      <circle
                        cx={cx}
                        cy={getY(d.actualLiters)}
                        r={5}
                        fill="#10B981"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                    )}

                    {/* X-Axis Day Labels */}
                    <text
                      x={cx}
                      y={chartHeight - 8}
                      textAnchor="middle"
                      className={`text-[11px] font-medium transition-colors ${
                        isHovered ? 'fill-sky-700 font-bold' : 'fill-slate-500'
                      }`}
                    >
                      {d.dayLabel}
                    </text>

                    {/* Tooltip Card on Hover */}
                    {isHovered && (
                      <g>
                        <rect
                          x={Math.min(chartWidth - 140, Math.max(10, cx - 65))}
                          y={Math.max(8, cy - 65)}
                          width="130"
                          height="52"
                          rx="8"
                          fill="#0F172A"
                          className="shadow-xl"
                        />
                        <text
                          x={Math.min(chartWidth - 140, Math.max(10, cx - 65)) + 65}
                          y={Math.max(8, cy - 65) + 20}
                          textAnchor="middle"
                          className="text-[11px] font-bold fill-white"
                        >
                          {d.predictedLiters.toLocaleString()} L
                        </text>
                        <text
                          x={Math.min(chartWidth - 140, Math.max(10, cx - 65)) + 65}
                          y={Math.max(8, cy - 65) + 38}
                          textAnchor="middle"
                          className="text-[9px] fill-sky-300"
                        >
                          Band: {(d.confidenceLower / 1000).toFixed(0)}k – {(d.confidenceUpper / 1000).toFixed(0)}kL
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Day-by-Day Forecast Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">7-Day Detailed Consumption Schedule</h3>
            <p className="text-xs text-slate-500">Environmental condition and behavioral impact breakdown</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Day / Date</th>
                <th className="px-5 py-3">Predicted Demand</th>
                <th className="px-5 py-3">Actual Logged</th>
                <th className="px-5 py-3">Confidence Margin</th>
                <th className="px-5 py-3">Weather Factor</th>
                <th className="px-5 py-3">Variance Driver</th>
                <th className="px-5 py-3 text-right">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {forecast.map((day) => (
                <tr key={day.dayLabel} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {day.dayLabel} <span className="text-slate-400 font-normal">({day.dateStr})</span>
                  </td>
                  <td className="px-5 py-3.5 font-extrabold text-sky-700 tabular-nums">
                    {day.predictedLiters.toLocaleString()} L
                  </td>
                  <td className="px-5 py-3.5 tabular-nums">
                    {day.actualLiters ? (
                      <span className="text-emerald-700 font-bold">
                        {day.actualLiters.toLocaleString()} L
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 tabular-nums">
                    ±{((day.confidenceUpper - day.confidenceLower) / 2).toLocaleString()} L
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 flex items-center gap-1.5">
                    <CloudSun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{day.weatherFactor}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {day.consumptionAnomaly}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        day.riskLevel === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-700'
                          : day.riskLevel === 'HIGH'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {day.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
