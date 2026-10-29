import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderClass = 'border-border';
        let iconColor = 'text-primary';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          iconColor = 'text-status-successText';
          borderClass = 'border-[#C8DFCA] bg-[#F3F8F3]';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'text-status-errorText';
          borderClass = 'border-[#EFCAC2] bg-[#FDF5F4]';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconColor = 'text-status-warningText';
          borderClass = 'border-[#EBDCBF] bg-[#FCF9F2]';
        } else {
          borderClass = 'border-border bg-card';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-card border ${borderClass} shadow-elevated transition-all animate-in slide-in-from-bottom-3 duration-200`}
            role="alert"
          >
            <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text-primary">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-text-secondary mt-0.5 leading-snug">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-text-muted hover:text-text-primary p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
