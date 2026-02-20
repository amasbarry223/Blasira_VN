import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: number; // Percentage change
  icon: LucideIcon;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  isLoading?: boolean;
  description?: string;
}

const colorClasses = {
  primary: {
    border: 'border-l-blasira-primary',
    iconBg: 'bg-blasira-primary/10',
    iconColor: 'text-blasira-primary',
  },
  secondary: {
    border: 'border-l-blasira-secondary',
    iconBg: 'bg-blasira-secondary/10',
    iconColor: 'text-blasira-secondary',
  },
  success: {
    border: 'border-l-blasira-success',
    iconBg: 'bg-blasira-success/10',
    iconColor: 'text-blasira-success',
  },
  warning: {
    border: 'border-l-blasira-warning',
    iconBg: 'bg-blasira-warning/10',
    iconColor: 'text-blasira-warning',
  },
  danger: {
    border: 'border-l-blasira-danger',
    iconBg: 'bg-blasira-danger/10',
    iconColor: 'text-blasira-danger',
  },
};

export const KpiCard = React.memo(function KpiCard({
  title,
  value,
  change,
  icon: Icon,
  color = 'primary',
  isLoading = false,
  description,
}: KpiCardProps) {
  const colors = colorClasses[color];
  const isPositive = change !== undefined && change >= 0;

  if (isLoading) {
    return (
      <Card className="rounded-xl border border-border bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
              {description && <Skeleton className="h-3 w-40" />}
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'rounded-xl border-l-4 border bg-card shadow-sm transition-all duration-200 hover:shadow-md',
        colors.border
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
              </p>
              {change !== undefined && (
                <div
                  className={cn(
                    'flex items-center gap-1 text-sm font-semibold',
                    isPositive ? 'text-blasira-success' : 'text-blasira-danger'
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{Math.abs(change).toFixed(1)}%</span>
                </div>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full',
              colors.iconBg
            )}
          >
            <Icon className={cn('h-6 w-6', colors.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

