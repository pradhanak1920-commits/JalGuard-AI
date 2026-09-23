import React, { useState } from 'react';
import { X, Truck, Calendar, Clock, CheckCircle2, IndianRupee, ShieldCheck } from 'lucide-react';
import { useWater } from '../../context/WaterContext';

export const BookTankerModal: React.FC = () => {
  const { bookingSupplier, closeBookingModal, bookTanker, suppliers } = useWater();

  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(
    bookingSupplier ? bookingSupplier.id : suppliers[0]?.id || ''
  );
  const [tankerVolume, setTankerVolume] = useState<number>(12000);
  const [deliverySlot, setDeliverySlot] = useState<string>('Tomorrow Morning (06:00 AM – 08:00 AM)');
  const [purpose, setPurpose] = useState<string>('Underground Sump Top-up (Domestic)');

  if (!bookingSupplier) return null;

  const activeSupplier = suppliers.find((s) => s.id === selectedSupplierId) || bookingSupplier;
  const costPerUnit = activeSupplier.pricePerTankerInr;
  const totalCost = Math.round((tankerVolume / 12000) * costPerUnit);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookTanker(activeSupplier.id, tankerVolume, deliverySlot);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Book Water Tanker</h3>
              <p className="text-xs text-slate-500">Green Valley Apartments · Facility Operations</p>
            </div>
          </div>
          <button
            onClick={closeBookingModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Supplier Picker */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1.5">Select Water Supplier</label>
            <div className="grid grid-cols-2 gap-2">
              {suppliers.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setSelectedSupplierId(s.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    s.id === selectedSupplierId
                      ? 'border-sky-600 bg-sky-50/50 ring-2 ring-sky-600/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 truncate">{s.name}</span>
                    {s.isAiRecommended && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-700">
                        AI Pick
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-slate-500 tabular-nums">
                    ₹{s.pricePerTankerInr.toLocaleString()} / 12kL
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                    {s.onTimeDeliveryRate}% on-time
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Volume selection */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1.5">Procurement Quantity</label>
            <div className="grid grid-cols-3 gap-2">
              {[6000, 12000, 24000].map((vol) => (
                <button
                  type="button"
                  key={vol}
                  onClick={() => setTankerVolume(vol)}
                  className={`py-2 px-3 rounded-lg border font-semibold text-center transition-colors ${
                    tankerVolume === vol
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm shadow-sky-600/30'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {(vol / 1000).toLocaleString()}k Litres
                  <span className="block text-[10px] opacity-80 font-normal">
                    {vol === 12000 ? 'Standard Tanker' : vol === 6000 ? 'Small Tanker' : '2x Tankers'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Slot */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1.5">Delivery Time Window</label>
            <select
              value={deliverySlot}
              onChange={(e) => setDeliverySlot(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs font-medium focus:outline-hidden focus:border-sky-500"
            >
              <option>Tomorrow Morning (06:00 AM – 08:00 AM) [Recommended]</option>
              <option>Today Evening (06:00 PM – 08:00 PM)</option>
              <option>Immediate Dispatch (Within 60 Minutes - Urgent)</option>
              <option>Thursday Morning (06:00 AM – 08:00 AM)</option>
            </select>
          </div>

          {/* Sump / Tank target */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1.5">Discharge Destination</label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs font-medium focus:outline-hidden focus:border-sky-500"
            >
              <option>Underground Sump Tank (150,000 L Capacity)</option>
              <option>Overhead Gravity Tank (Booster Feed)</option>
              <option>RO Drinking Water Pre-Treatment Tank</option>
            </select>
          </div>

          {/* Cost Preview Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-500">Estimated Procurement Total</div>
              <div className="text-base font-extrabold text-slate-900 tabular-nums">
                ₹{totalCost.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400">Paid via Apartment Society Association Account</div>
            </div>
            <div className="text-right text-[11px] text-slate-600">
              <div>Supplier: <strong>{activeSupplier.name}</strong></div>
              <div>ETA: <strong>~{activeSupplier.avgDeliveryTimeMinutes} mins</strong></div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeBookingModal}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm shadow-sky-600/30 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm Tanker Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
