import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Clock, AlertCircle, UserCheck, Car } from 'lucide-react';

type StatusType =
  | 'active'
  | 'suspended'
  | 'pending'
  | 'verified'
  | 'student'
  | 'driver'
  | 'rejected'
  | 'published'
  | 'full'
  | 'completed'
  | 'cancelled'
  | 'confirmed';

interface StatusBadgeProps {
  status: StatusType;
  showIcon?: boolean;
  showPulse?: boolean;
  className?: string;
}

const statusConfig: Record<
  StatusType,
  {
    label: string;
    color: string;
    bgColor: string;
    icon?: React.ComponentType<{ className?: string }>;
  }
> = {
  active: {
    label: 'Actif',
    color: 'text-blasira-success',
    bgColor: 'bg-blasira-success/10',
    icon: CheckCircle2,
  },
  suspended: {
    label: 'Suspendu',
    color: 'text-blasira-danger',
    bgColor: 'bg-blasira-danger/10',
    icon: XCircle,
  },
  pending: {
    label: 'En attente',
    color: 'text-blasira-warning',
    bgColor: 'bg-blasira-warning/10',
    icon: Clock,
  },
  verified: {
    label: 'Vérifié',
    color: 'text-blasira-primary',
    bgColor: 'bg-blasira-primary/10',
    icon: CheckCircle2,
  },
  student: {
    label: 'Étudiant vérifié',
    color: 'text-blasira-secondary',
    bgColor: 'bg-blasira-secondary/10',
    icon: UserCheck,
  },
  driver: {
    label: 'Conducteur confirmé',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    icon: Car,
  },
  rejected: {
    label: 'Rejeté',
    color: 'text-blasira-danger',
    bgColor: 'bg-blasira-danger/10',
    icon: XCircle,
  },
  published: {
    label: 'Publié',
    color: 'text-blasira-primary',
    bgColor: 'bg-blasira-primary/10',
    icon: CheckCircle2,
  },
  full: {
    label: 'Complet',
    color: 'text-blasira-warning',
    bgColor: 'bg-blasira-warning/10',
    icon: AlertCircle,
  },
  completed: {
    label: 'Terminé',
    color: 'text-blasira-success',
    bgColor: 'bg-blasira-success/10',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Annulé',
    color: 'text-blasira-danger',
    bgColor: 'bg-blasira-danger/10',
    icon: XCircle,
  },
  confirmed: {
    label: 'Confirmé',
    color: 'text-blasira-success',
    bgColor: 'bg-blasira-success/10',
    icon: CheckCircle2,
  },
};

export function StatusBadge({
  status,
  showIcon = true,
  showPulse = false,
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  if (!config) {
    return null;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        config.color,
        config.bgColor,
        showPulse && status === 'active' && 'animate-pulse',
        className
      )}
    >
      {showIcon && Icon && (
        <Icon className={cn('h-3 w-3', config.color)} aria-hidden="true" />
      )}
      <span className={config.color}>{config.label}</span>
      {showPulse && status === 'active' && (
        <span
          className={cn(
            'absolute h-2 w-2 rounded-full',
            config.bgColor,
            'animate-ping'
          )}
          aria-hidden="true"
        />
      )}
    </span>
  );
}

