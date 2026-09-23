export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface TankData {
  id: string;
  name: string;
  type: 'underground' | 'overhead';
  capacityLiters: number;
  currentLiters: number;
  percentage: number;
  inflowRateLitersPerHour: number;
  outflowRateLitersPerHour: number;
  hoursRemaining: number;
  sensorStatus: 'ONLINE' | 'STANDBY' | 'MAINTENANCE';
  lastUpdatedMinutesAgo: number;
  depthMeters: number;
  maxDepthMeters: number;
}

export interface DayForecast {
  dayLabel: string;
  dateStr: string;
  predictedLiters: number;
  actualLiters?: number;
  confidenceLower: number;
  confidenceUpper: number;
  weatherFactor: string; // e.g. "Sunny · 34°C"
  consumptionAnomaly: string; // e.g. "+8% vs avg"
  riskLevel: RiskLevel;
}

export interface ProcurementRecommendation {
  id: string;
  category: 'Cooking/Utility Water' | 'Drinking RO Plant' | 'Common Maintenance';
  recommendedQuantityLiters: number;
  recommendedDate: string;
  recommendedTimeWindow: string;
  estimatedCostInr: number;
  supplierName: string;
  supplierId: string;
  riskTrigger: RiskLevel;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'IN_TRANSIT' | 'DELIVERED';
  approvedAt?: string;
  deliverySlot?: string;
  factors: {
    consumptionSurgePct: number;
    municipalDeficitLiters: number;
    borewellOutputDeficitPct: number;
    safetyReserveBufferLiters: number;
  };
}

export interface Supplier {
  id: string;
  name: string;
  pricePerTankerInr: number; // For 12,000 L
  tankerCapacityLiters: number;
  onTimeDeliveryRate: number; // percentage
  avgDeliveryTimeMinutes: number;
  reliability: 'High' | 'Medium' | 'Medium-Low';
  verifiedVendor: boolean;
  contactNumber: string;
  isAiRecommended?: boolean;
  aiRecommendationReason?: string;
}

export interface AlertItem {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFORMATION';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionTarget?: string;
}

export interface WhatIfScenarioPreset {
  id: string;
  title: string;
  description: string;
  municipalSupplyPct: number; // 0% means unavailable
  consumptionChangePct: number; // +20%
  heatwaveTempOffset: number; // +4°C
  rainfallReductionPct: number; // 10%
  tankerDelayHours: number; // 6 hrs
}

export interface SimulationResult {
  scenarioTitle: string;
  currentWaterLiters: number;
  expectedConsumptionLiters: number;
  expectedInflowLiters: number;
  safetyReserveLiters: number;
  projectedNetBalanceLiters: number;
  projectedShortageLiters: number;
  hoursUntilShortage: number;
  shortageTimeDescription: string;
  riskLevel: RiskLevel;
  aiRecommendation: string;
  recommendedTankers: number;
  estimatedAdditionalCostInr: number;
}

export interface PropertySettings {
  propertyName: string;
  location: string;
  apartmentsCount: number;
  residentsCount: number;
  undergroundCapacityLiters: number;
  overheadCapacityLiters: number;
  borewellCapacityLph: number;
  minimumSafetyReserveLiters: number;
  dailyExpectedConsumptionLiters: number;
  whatsappAlerts: boolean;
  whatsappNumber: string;
  emailAlerts: boolean;
  emailAddress: string;
  criticalSmsAlerts: boolean;
  dailyAiReport: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  dataHighlights?: {
    label: string;
    value: string;
  }[];
}
