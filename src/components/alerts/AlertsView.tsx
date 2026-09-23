import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle2,
  Trash2,
  Check,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useWater, NavigationTab } from '../../context/WaterContext';

export const AlertsView: React.FC = () => {
  const {
    alerts,
    markAlertRead,
    dismissAlert,
    markAllAlertsRead,
    setActiveTab,
  } = useWater();

  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'INFORMATION'>('ALL');

  const filtered = alerts.filter((a) => {
    if (severityFilter === 'ALL') return true;
    return a.severity === severityFilter;
  });

  const handleAction = (alertId: string, target?: string) => {
    markAlertRead(alertId);
    if (target) {
      setActiveTab(target as NavigationTab);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Operational Alerts & Incident Logs
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              {alerts.length} Total
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time telemetry threshold triggers, pump state logs, and municipal delivery updates.
          </p>
        </div>

        {alerts.length > 0 && (
          <button
            onClick={markAllAlertsRead}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium w-fit">
        <button
          onClick={() => setSeverityFilter('ALL')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            severityFilter === 'ALL'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All ({alerts.length})
        </button>
        <button
          onClick={() => setSeverityFilter('CRITICAL')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            severityFilter === 'CRITICAL'
              ? 'bg-white text-rose-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Critical ({alerts.filter((a) => a.severity === 'CRITICAL').length})
        </button>
        <button
          onClick={() => setSeverityFilter('WARNING')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            severityFilter === 'WARNING'
              ? 'bg-white text-amber-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Warning ({alerts.filter((a) => a.severity === 'WARNING').length})
        </button>
        <button
          onClick={() => setSeverityFilter('INFORMATION')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            severityFilter === 'INFORMATION'
              ? 'bg-white text-sky-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Information ({alerts.filter((a) => a.severity === 'INFORMATION').length})
        </button>
      </div>

      {/* Alert Cards List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-900">No active alerts</div>
            <p className="text-xs text-slate-500 mt-1">All water levels and systems are within nominal parameters.</p>
          </div>
        ) : (
          filtered.map((item) => {
            const isCritical = item.severity === 'CRITICAL';
            const isWarning = item.severity === 'WARNING';

            const borderClass = isCritical
              ? 'border-rose-200 bg-rose-50/30'
              : isWarning
              ? 'border-amber-200 bg-amber-50/20'
              : 'border-slate-200 bg-white';

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${borderClass} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isCritical
                        ? 'bg-rose-100 text-rose-600'
                        : isWarning
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-sky-100 text-sky-600'
                    }`}
                  >
                    {isCritical ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <Info className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isCritical
                            ? 'bg-rose-600 text-white'
                            : isWarning
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-sky-600 text-white'
                        }`}
                      >
                        {item.severity}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
                      <span className="text-[11px] text-slate-400">· {item.timestamp}</span>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-sky-500" title="Unread" />
                      )}
                    </div>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {item.actionLabel && (
                    <button
                      onClick={() => handleAction(item.id, item.actionTarget)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors flex items-center gap-1"
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {!item.read && (
                    <button
                      onClick={() => markAlertRead(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => dismissAlert(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                    title="Dismiss alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
