import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Layers,
  Sparkles,
  SlidersHorizontal,
  Truck,
  BarChart3,
  Bell,
  Settings,
  Droplet,
  ChevronRight,
} from 'lucide-react';
import { useWater, NavigationTab } from '../../context/WaterContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeTab, setActiveTab, unreadAlertCount, settings } = useWater();

  const navItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'forecast', label: 'Water Forecast', icon: TrendingUp },
    { id: 'tanks', label: 'Tank Monitor', icon: Layers },
    { id: 'recommendations', label: 'AI Recommendations', icon: Sparkles },
    { id: 'simulator', label: 'What-If Simulator', icon: SlidersHorizontal },
    { id: 'suppliers', label: 'Suppliers', icon: Truck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: unreadAlertCount },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: NavigationTab) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* App Brand Header */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white shrink-0">
              <Droplet className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white">JalGuard</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-400/30">AI</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">Predict. Protect. Procure.</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Operations & Planning
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Demo Property Info Box */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-200 truncate">{settings.propertyName}</p>
              <p className="text-[11px] text-slate-400 truncate">{settings.location}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shadow-[0_0_8px_rgba(52,211,153,0.8)]" title="System Live" />
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 tabular-nums">
            <span>{settings.apartmentsCount} Flats</span>
            <span>·</span>
            <span>{settings.residentsCount} Residents</span>
          </div>
        </div>
      </aside>
    </>
  );
};
