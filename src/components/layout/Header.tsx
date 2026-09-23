import React, { useState } from 'react';
import {
  Menu,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Building2,
  Check,
} from 'lucide-react';
import { useWater, NavigationTab } from '../../context/WaterContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const {
    settings,
    alerts,
    unreadAlertCount,
    markAlertRead,
    markAllAlertsRead,
    setActiveTab,
    liveUpdatesEnabled,
    setLiveUpdatesEnabled,
  } = useWater();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleAlertClick = (target?: string, alertId?: string) => {
    if (alertId) markAlertRead(alertId);
    if (target) {
      setActiveTab(target as NavigationTab);
    }
    setNotificationsOpen(false);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left zone: Mobile toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
            <Building2 className="w-3.5 h-3.5 text-sky-600" />
            <span className="font-semibold text-slate-800">{settings.propertyName}</span>
            <span>·</span>
            <span>{settings.location}</span>
          </div>
        </div>
      </div>

      {/* Right zone: Live Sensor indicator + Notifications + User Avatar */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Sensor Live Pulse Button */}
        <button
          onClick={() => setLiveUpdatesEnabled(!liveUpdatesEnabled)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            liveUpdatesEnabled
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
          }`}
          title={liveUpdatesEnabled ? 'Click to pause simulated live updates' : 'Click to resume live sensor streaming'}
        >
          <Radio className={`w-3.5 h-3.5 ${liveUpdatesEnabled ? 'animate-pulse text-emerald-600' : 'text-slate-400'}`} />
          <span className="hidden md:inline">{liveUpdatesEnabled ? 'Sensors Live' : 'Sensors Paused'}</span>
        </button>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
            aria-label="Open notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setNotificationsOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">Notifications</span>
                    {unreadAlertCount > 0 && (
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                        {unreadAlertCount} new
                      </span>
                    )}
                  </div>
                  {unreadAlertCount > 0 && (
                    <button
                      onClick={markAllAlertsRead}
                      className="text-xs text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {alerts.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No active notifications
                    </div>
                  ) : (
                    alerts.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleAlertClick(item.actionTarget, item.id)}
                        className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                          !item.read ? 'bg-sky-50/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {item.severity === 'CRITICAL' ? (
                            <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                          ) : item.severity === 'WARNING' ? (
                            <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className={`text-xs font-semibold truncate ${!item.read ? 'text-slate-900' : 'text-slate-700'}`}>
                                {item.title}
                              </p>
                              <span className="text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                              {item.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
                  <button
                    onClick={() => {
                      setActiveTab('alerts');
                      setNotificationsOpen(false);
                    }}
                    className="text-xs text-sky-600 hover:text-sky-800 font-semibold py-1"
                  >
                    View all alerts & history →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Avatar Lockup */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition-colors text-left"
          >
            {/* Styled Avatar with initials and indicator */}
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-700 to-blue-500 text-white font-semibold text-xs flex items-center justify-center shadow-xs border border-white">
                RK
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="hidden md:block">
              <div className="text-xs font-semibold text-slate-900 leading-tight">Ravi Kumar</div>
              <div className="text-[11px] text-slate-500 leading-tight">Facility Manager</div>
            </div>
          </button>

          {/* Profile Menu */}
          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2 animate-in fade-in duration-150">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">Ravi Kumar</p>
                  <p className="text-[11px] text-slate-500 truncate">facility.greenvalley@gmail.com</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-md font-medium"
                  >
                    Facility Configuration
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('alerts');
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-md font-medium"
                  >
                    Alert Subscriptions
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
