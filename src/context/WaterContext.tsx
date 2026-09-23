import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TankData,
  DayForecast,
  ProcurementRecommendation,
  Supplier,
  AlertItem,
  PropertySettings,
  SimulationResult,
} from '../types';
import {
  INITIAL_TANKS,
  INITIAL_PROPERTY_SETTINGS,
  FORECAST_DATA,
  INITIAL_RECOMMENDATIONS,
  INITIAL_SUPPLIERS,
  INITIAL_ALERTS,
} from '../data/mockData';

export type NavigationTab =
  | 'dashboard'
  | 'forecast'
  | 'tanks'
  | 'recommendations'
  | 'simulator'
  | 'suppliers'
  | 'analytics'
  | 'alerts'
  | 'settings';

interface WaterContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  tanks: TankData[];
  settings: PropertySettings;
  updateSettings: (newSettings: PropertySettings) => void;
  forecast: DayForecast[];
  recommendations: ProcurementRecommendation[];
  suppliers: Supplier[];
  alerts: AlertItem[];
  unreadAlertCount: number;
  markAlertRead: (id: string) => void;
  dismissAlert: (id: string) => void;
  markAllAlertsRead: () => void;
  approveRecommendation: (id: string) => void;
  bookTanker: (supplierId: string, quantityLiters: number, slot: string) => void;
  whyModalItem: ProcurementRecommendation | null;
  openWhyModal: (item: ProcurementRecommendation) => void;
  closeWhyModal: () => void;
  bookingSupplier: Supplier | null;
  openBookingModal: (supplier: Supplier) => void;
  closeBookingModal: () => void;
  liveUpdatesEnabled: boolean;
  setLiveUpdatesEnabled: (val: boolean) => void;
  pumpBoosterActive: boolean;
  togglePumpBooster: () => void;
  applySimulationRecommendation: (result: SimulationResult) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const WaterContext = createContext<WaterContextType | undefined>(undefined);

export const WaterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [settings, setSettings] = useState<PropertySettings>(INITIAL_PROPERTY_SETTINGS);
  const [tanks, setTanks] = useState<TankData[]>(INITIAL_TANKS);
  const [forecast] = useState<DayForecast[]>(FORECAST_DATA);
  const [recommendations, setRecommendations] = useState<ProcurementRecommendation[]>(INITIAL_RECOMMENDATIONS);
  const [suppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [whyModalItem, setWhyModalItem] = useState<ProcurementRecommendation | null>(null);
  const [bookingSupplier, setBookingSupplier] = useState<Supplier | null>(null);
  const [liveUpdatesEnabled, setLiveUpdatesEnabled] = useState<boolean>(true);
  const [pumpBoosterActive, setPumpBoosterActive] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Simulated live sensor updates every 4 seconds
  useEffect(() => {
    if (!liveUpdatesEnabled) return;

    const interval = setInterval(() => {
      setTanks((prevTanks) =>
        prevTanks.map((tank) => {
          // slight fluctuation
          const delta = (Math.random() - 0.52) * 120; // net slight drain
          const newCurrent = Math.min(
            tank.capacityLiters,
            Math.max(5000, Math.round(tank.currentLiters + delta))
          );
          const newPct = Math.round((newCurrent / tank.capacityLiters) * 100);
          const newDepth = Number(((newCurrent / tank.capacityLiters) * tank.maxDepthMeters).toFixed(2));
          
          return {
            ...tank,
            currentLiters: newCurrent,
            percentage: newPct,
            depthMeters: newDepth,
            lastUpdatedMinutesAgo: 0,
            inflowRateLitersPerHour: Math.round(tank.inflowRateLitersPerHour + (Math.random() - 0.5) * 60),
            outflowRateLitersPerHour: Math.round(tank.outflowRateLitersPerHour + (Math.random() - 0.5) * 80),
          };
        })
      );
    }, 4500);

    return () => clearInterval(interval);
  }, [liveUpdatesEnabled]);

  const unreadAlertCount = alerts.filter((a) => !a.read).length;

  const markAlertRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast('Alert dismissed');
  };

  const markAllAlertsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    showToast('All alerts marked as read');
  };

  const approveRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) =>
        rec.id === id
          ? {
              ...rec,
              status: 'APPROVED',
              approvedAt: 'Just now',
              deliverySlot: 'Wednesday 07:00 AM',
            }
          : rec
      )
    );
    showToast('Procurement order approved & dispatch scheduled with supplier!');
  };

  const bookTanker = (supplierId: string, quantityLiters: number, slot: string) => {
    const supplier = suppliers.find((s) => s.id === supplierId) || suppliers[0];
    const newRec: ProcurementRecommendation = {
      id: `order-${Date.now()}`,
      category: 'Cooking/Utility Water',
      recommendedQuantityLiters: quantityLiters,
      recommendedDate: 'Today',
      recommendedTimeWindow: slot,
      estimatedCostInr: Math.round((quantityLiters / 12000) * supplier.pricePerTankerInr),
      supplierName: supplier.name,
      supplierId: supplier.id,
      riskTrigger: 'MODERATE',
      reason: `Direct order placed by Facility Manager for ${quantityLiters.toLocaleString()} L delivery.`,
      status: 'APPROVED',
      approvedAt: 'Just now',
      deliverySlot: slot,
      factors: {
        consumptionSurgePct: 0,
        municipalDeficitLiters: 12000,
        borewellOutputDeficitPct: 0,
        safetyReserveBufferLiters: 20000,
      },
    };
    setRecommendations((prev) => [newRec, ...prev]);
    showToast(`Order confirmed with ${supplier.name}! Tanker in queue.`);
    setBookingSupplier(null);
  };

  const updateSettings = (newSettings: PropertySettings) => {
    setSettings(newSettings);
    showToast('Facility settings saved successfully');
  };

  const togglePumpBooster = () => {
    setPumpBoosterActive((prev) => !prev);
    showToast(
      !pumpBoosterActive
        ? 'Underground-to-Overhead booster pump started'
        : 'Underground booster pump set to standby'
    );
  };

  const applySimulationRecommendation = (result: SimulationResult) => {
    const newRec: ProcurementRecommendation = {
      id: `sim-rec-${Date.now()}`,
      category: 'Cooking/Utility Water',
      recommendedQuantityLiters: result.recommendedTankers * 12000,
      recommendedDate: 'Next 24 Hours',
      recommendedTimeWindow: '06:00 AM - 09:00 AM',
      estimatedCostInr: result.estimatedAdditionalCostInr,
      supplierName: 'AquaFlow Tankers',
      supplierId: 'sup-aquaflow',
      riskTrigger: result.riskLevel,
      reason: `What-If Scenario '${result.scenarioTitle}': Projected shortage of ${result.projectedShortageLiters.toLocaleString()} L.`,
      status: 'PENDING',
      factors: {
        consumptionSurgePct: 15,
        municipalDeficitLiters: result.projectedShortageLiters,
        borewellOutputDeficitPct: 0,
        safetyReserveBufferLiters: result.safetyReserveLiters,
      },
    };
    setRecommendations((prev) => [newRec, ...prev]);
    setActiveTab('recommendations');
    showToast('Simulation recommendation applied to active procurement pipeline!');
  };

  const openWhyModal = (item: ProcurementRecommendation) => {
    setWhyModalItem(item);
  };

  const closeWhyModal = () => {
    setWhyModalItem(null);
  };

  const openBookingModal = (supplier: Supplier) => {
    setBookingSupplier(supplier);
  };

  const closeBookingModal = () => {
    setBookingSupplier(null);
  };

  return (
    <WaterContext.Provider
      value={{
        activeTab,
        setActiveTab,
        tanks,
        settings,
        updateSettings,
        forecast,
        recommendations,
        suppliers,
        alerts,
        unreadAlertCount,
        markAlertRead,
        dismissAlert,
        markAllAlertsRead,
        approveRecommendation,
        bookTanker,
        whyModalItem,
        openWhyModal,
        closeWhyModal,
        bookingSupplier,
        openBookingModal,
        closeBookingModal,
        liveUpdatesEnabled,
        setLiveUpdatesEnabled,
        pumpBoosterActive,
        togglePumpBooster,
        applySimulationRecommendation,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </WaterContext.Provider>
  );
};

export const useWater = () => {
  const context = useContext(WaterContext);
  if (!context) {
    throw new Error('useWater must be used within a WaterProvider');
  }
  return context;
};
