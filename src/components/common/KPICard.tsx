import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  change?: number; // e.g. +8.4 or -2.1
  changePeriod?: string; // e.g. "vs prior 30d"
  subtitle?: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  accent?: 'forest' | 'terracotta' | 'neutral';
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  change,
  changePeriod = 'vs prior period',
  subtitle,
  badge,
  icon,
  onClick,
  accent = 'neutral',
}) => {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change !== undefined && change === 0;

  return (
    <div
      onClick={onClick}
      className={`bg-card rounded-card border border-border p-5 shadow-soft transition-all duration-200 hover:shadow-card hover:border-[#D5DCD0] ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-text-secondary">
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          {badge}
          {icon && <span className="text-text-muted">{icon}</span>}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <span className="text-2xl lg:text-3xl font-semibold tracking-tight text-text-primary tabular-nums">
          {value}
        </span>
      </div>

      {(change !== undefined || subtitle) && (
        <div className="mt-2.5 flex items-center justify-between text-xs text-text-muted gap-2">
          {change !== undefined && (
            <div className="flex items-center gap-1 font-medium">
              {isPositive && (
                <span className="inline-flex items-center text-status-successText bg-status-successBg px-1.5 py-0.5 rounded">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />+{change}%
                </span>
              )}
              {isNegative && (
                <span className="inline-flex items-center text-status-errorText bg-status-errorBg px-1.5 py-0.5 rounded">
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />{change}%
                </span>
              )}
              {isNeutral && (
                <span className="inline-flex items-center text-text-secondary bg-sage px-1.5 py-0.5 rounded">
                  <Minus className="w-3 h-3 mr-0.5" />0%
                </span>
              )}
              <span className="text-text-muted">{changePeriod}</span>
            </div>
          )}

          {subtitle && <span className="truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
