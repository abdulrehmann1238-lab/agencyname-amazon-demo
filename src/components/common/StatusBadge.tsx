import React from 'react';

export type BadgeVariant =
  | 'healthy'
  | 'critical'
  | 'risk'
  | 'info'
  | 'warning'
  | 'neutral'
  | 'approved'
  | 'needs_review'
  | 'rejected'
  | 'changes_requested';

interface StatusBadgeProps {
  variant: BadgeVariant | string;
  label?: string;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant,
  label,
  size = 'md',
  dot = true,
}) => {
  let displayLabel = label;
  let bgClass = 'bg-sand text-text-primary border-sand-dark';
  let dotClass = 'bg-text-secondary';

  switch (variant) {
    case 'healthy':
    case 'approved':
    case 'ACTIVE':
    case 'ready':
    case 'completed':
    case 'authorized':
    case 'Demo configured':
      displayLabel = label || 'Healthy';
      bgClass = 'bg-status-successBg text-status-successText border-[#C8DFCA]';
      dotClass = 'bg-[#345B49]';
      break;

    case 'critical':
    case 'rejected':
    case 'urgent':
    case 'suppressed':
      displayLabel = label || 'Critical';
      bgClass = 'bg-status-errorBg text-status-errorText border-[#EFCAC2]';
      dotClass = 'bg-[#8E382A]';
      break;

    case 'risk':
    case 'needs_review':
    case 'high':
    case 'suboptimal':
    case 'Requires authorization':
    case 'warning':
    case 'in_progress':
      displayLabel = label || 'At Risk';
      bgClass = 'bg-status-warningBg text-status-warningText border-[#EBDCBF]';
      dotClass = 'bg-[#B87559]';
      break;

    case 'info':
    case 'drafted':
    case 'review_requested':
    case 'changes_requested':
    case 'medium':
    case 'Planned':
      displayLabel = label || 'In Review';
      bgClass = 'bg-status-infoBg text-status-infoText border-[#CFDDE7]';
      dotClass = 'bg-[#2A5576]';
      break;

    default:
      displayLabel = label || String(variant);
      bgClass = 'bg-sage-light text-text-secondary border-border';
      dotClass = 'bg-text-muted';
      break;
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${bgClass} ${sizeClasses} whitespace-nowrap`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotClass} flex-shrink-0`} />}
      <span>{displayLabel}</span>
    </span>
  );
};
