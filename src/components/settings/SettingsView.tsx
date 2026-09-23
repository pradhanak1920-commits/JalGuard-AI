import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Layers,
  Bell,
  Save,
  CheckCircle2,
  Mail,
  Phone,
  Droplet,
  ShieldAlert,
} from 'lucide-react';
import { useWater } from '../../context/WaterContext';
import { PropertySettings } from '../../types';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useWater();
  const [formData, setFormData] = useState<PropertySettings>(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Facility & Infrastructure Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure property parameters, storage thresholds, and autonomous notification triggers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Section 1: Property Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-sky-600" />
            <h2 className="font-bold text-sm text-slate-900">Property Demographics</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Property Name</label>
              <input
                type="text"
                value={formData.propertyName}
                onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:border-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Location / City</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:border-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Total Apartment Flats</label>
              <input
                type="number"
                value={formData.apartmentsCount}
                onChange={(e) => setFormData({ ...formData, apartmentsCount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:border-sky-500 font-mono font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Permanent Residents</label>
              <input
                type="number"
                value={formData.residentsCount}
                onChange={(e) => setFormData({ ...formData, residentsCount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:border-sky-500 font-mono font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Water Infrastructure */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Layers className="w-4 h-4 text-sky-600" />
            <h2 className="font-bold text-sm text-slate-900">Water Infrastructure & Safety Reserves</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Underground Sump Capacity (Litres)
              </label>
              <input
                type="number"
                value={formData.undergroundCapacityLiters}
                onChange={(e) =>
                  setFormData({ ...formData, undergroundCapacityLiters: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:border-sky-500 font-mono font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Overhead Tank Capacity (Litres)
              </label>
              <input
                type="number"
                value={formData.overheadCapacityLiters}
                onChange={(e) =>
                  setFormData({ ...formData, overheadCapacityLiters: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:border-sky-500 font-mono font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Minimum Safety Reserve Buffer (Litres)
              </label>
              <input
                type="number"
                value={formData.minimumSafetyReserveLiters}
                onChange={(e) =>
                  setFormData({ ...formData, minimumSafetyReserveLiters: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:border-sky-500 font-mono font-medium"
              />
              <span className="text-[10px] text-rose-500 mt-1 block">
                Shortage alerts trigger when storage is projected to breach this reserve level.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Daily Expected Baseline Demand (Litres)
              </label>
              <input
                type="number"
                value={formData.dailyExpectedConsumptionLiters}
                onChange={(e) =>
                  setFormData({ ...formData, dailyExpectedConsumptionLiters: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:border-sky-500 font-mono font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Notification Channels */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-4 h-4 text-sky-600" />
            <h2 className="font-bold text-sm text-slate-900">Notification & Alert Channels</h2>
          </div>

          <div className="space-y-4">
            {/* WhatsApp */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Shortage Alerts</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Instant WhatsApp dispatch message with 1-click supplier booking link.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="+91 98450 12345"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-mono text-xs"
                />
                <input
                  type="checkbox"
                  checked={formData.whatsappAlerts}
                  onChange={(e) => setFormData({ ...formData, whatsappAlerts: e.target.checked })}
                  className="w-4 h-4 accent-sky-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Email */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-sky-600" />
                  <span>Email Daily AI Reports</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Daily 06:30 AM executive summary for Society Managing Committee.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="email"
                  value={formData.emailAddress}
                  onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                  className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs min-w-[200px]"
                />
                <input
                  type="checkbox"
                  checked={formData.emailAlerts}
                  onChange={(e) => setFormData({ ...formData, emailAlerts: e.target.checked })}
                  className="w-4 h-4 accent-sky-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Critical SMS */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Critical Shortage Priority SMS</div>
                <p className="text-slate-500 text-[11px]">
                  High-priority broadcast when storage drops below 20,000 L safety reserve.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.criticalSmsAlerts}
                onChange={(e) => setFormData({ ...formData, criticalSmsAlerts: e.target.checked })}
                className="w-4 h-4 accent-sky-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-600/30 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
};
