import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Boxes,
  ShieldAlert,
  UserPlus,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useApp();
  const navigate = useNavigate();

  if (!isNotificationDrawerOpen) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'inventory':
        return <Boxes className="w-4 h-4 text-terracotta" />;
      case 'health':
        return <ShieldAlert className="w-4 h-4 text-status-errorText" />;
      case 'approval':
        return <CheckCircle2 className="w-4 h-4 text-primary" />;
      case 'onboarding':
        return <UserPlus className="w-4 h-4 text-[#2A5576]" />;
      default:
        return <Bell className="w-4 h-4 text-text-muted" />;
    }
  };

  const handleNotificationClick = (id: string, actionRoute?: string) => {
    markNotificationAsRead(id);
    if (actionRoute) {
      navigate(actionRoute);
      setIsNotificationDrawerOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#202820]/30 backdrop-blur-sm"
        onClick={() => setIsNotificationDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex pl-10 max-w-full">
        <div className="w-screen max-w-sm bg-card border-l border-border shadow-elevated flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border bg-[#FBFBFA]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-text-primary">
                Activity & Alerts
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsAsRead}
                className="text-xs text-primary hover:underline font-medium"
              >
                Mark all read
              </button>
              <button
                onClick={() => setIsNotificationDrawerOpen(false)}
                className="p-1 text-text-muted hover:text-text-primary rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/60">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item.id, item.actionRoute)}
                className={`p-4 transition-colors cursor-pointer hover:bg-sage/40 ${
                  !item.read ? 'bg-[#F9FAF8]' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-card border border-border flex-shrink-0 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <p
                        className={`text-xs truncate ${
                          !item.read ? 'font-semibold text-text-primary' : 'text-text-secondary'
                        }`}
                      >
                        {item.title}
                      </p>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-status-warningText flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                      {item.message}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-1 text-[11px] text-text-muted">
                      <span>{item.timestamp}</span>
                      {item.actionRoute && (
                        <span className="text-primary font-medium flex items-center gap-0.5">
                          Open <ExternalLink className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="p-8 text-center text-xs text-text-muted">
                No active notifications.
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="p-3 bg-[#FBFBFA] border-t border-border text-[11px] text-text-muted text-center">
            Simulated operational alerts from SP-API, Keepa & 3PLs
          </div>
        </div>
      </div>
    </div>
  );
};
