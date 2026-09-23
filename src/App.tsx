import React, { useState } from 'react';
import { WaterProvider, useWater } from './context/WaterContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { WaterForecastView } from './components/forecast/WaterForecastView';
import { TankMonitorView } from './components/tanks/TankMonitorView';
import { RecommendationsView } from './components/recommendations/RecommendationsView';
import { WhatIfSimulatorView } from './components/simulator/WhatIfSimulatorView';
import { SuppliersView } from './components/suppliers/SuppliersView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { AlertsView } from './components/alerts/AlertsView';
import { SettingsView } from './components/settings/SettingsView';
import { WhyModal } from './components/common/WhyModal';
import { BookTankerModal } from './components/common/BookTankerModal';
import { Toast } from './components/common/Toast';
import { AiChatAssistant } from './components/chat/AiChatAssistant';
import {
  LayoutDashboard,
  TrendingUp,
  Layers,
  Sparkles,
  SlidersHorizontal,
  Truck,
  BarChart3,
  Bell,
  Settings as SettingsIcon,
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, unreadAlertCount } = useWater();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Render current tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'forecast':
        return <WaterForecastView />;
      case 'tanks':
        return <TankMonitorView />;
      case 'recommendations':
        return <RecommendationsView />;
      case 'simulator':
        return <WhatIfSimulatorView />;
      case 'suppliers':
        return <SuppliersView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'alerts':
        return <AlertsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop & Mobile Slide-out Sidebar */}
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header onMenuClick={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 lg:pb-8">
          {renderTabContent()}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-30 lg:hidden flex items-center justify-around py-1 px-2 shadow-lg">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
              activeTab === 'dashboard' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('forecast')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
              activeTab === 'forecast' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 mb-0.5" />
            <span>Forecast</span>
          </button>

          <button
            onClick={() => setActiveTab('tanks')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
              activeTab === 'tanks' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 mb-0.5" />
            <span>Tanks</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
              activeTab === 'simulator' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 mb-0.5" />
            <span>Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors relative ${
              activeTab === 'alerts' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4 mb-0.5" />
            <span>Alerts</span>
            {unreadAlertCount > 0 && (
              <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>
        </nav>
      </div>

      {/* Global Modals & Notifications */}
      <WhyModal />
      <BookTankerModal />
      <Toast />
      <AiChatAssistant />
    </div>
  );
};

export default function App() {
  return (
    <WaterProvider>
      <MainAppContent />
    </WaterProvider>
  );
}
