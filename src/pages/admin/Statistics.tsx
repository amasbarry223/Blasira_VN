import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

import { supabase } from '@/integrations/supabase/client';
import { BOOKING_STATUS_LABELS, ROLES, TRIP_TYPES } from '@/utils/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Constantes pour les couleurs des graphiques
 */
const CHART_COLORS = {
  primary: 'hsl(var(--blasira-primary))',
  secondary: 'hsl(var(--blasira-secondary))',
  success: 'hsl(var(--blasira-success))',
  warning: 'hsl(var(--blasira-warning))',
  danger: 'hsl(var(--blasira-danger))',
  blue: '#3b82f6',
  purple: '#a855f7',
  indigo: '#6366f1',
  orange: '#f97316',
  yellow: '#eab308',
  green: '#22c55e',
  red: '#ef4444',
  gray: '#6b7280',
} as const;

/**
 * Tableau de couleurs pour les graphiques (réutilisable)
 */
const COLOR_PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.danger,
  CHART_COLORS.blue,
  CHART_COLORS.purple,
  CHART_COLORS.indigo,
] as const;

/**
 * Fonction helper pour obtenir une couleur par index de manière cyclique
 */
const getColorByIndex = (index: number): string => {
  if (index < 0 || !Number.isFinite(index)) {
    return COLOR_PALETTE[0];
  }
  return COLOR_PALETTE[index % COLOR_PALETTE.length];
};

/**
 * Mapping des couleurs de statut vers les couleurs du thème
 */
const STATUS_COLOR_MAP: Record<string, string> = {
  green: CHART_COLORS.success,
  yellow: CHART_COLORS.warning,
  red: CHART_COLORS.danger,
  blue: CHART_COLORS.blue,
  orange: CHART_COLORS.orange,
} as const;

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const Statistics = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-statistics'],
    queryFn: async () => {
      const [usersByRole, tripsByType, bookingsByStatus] = await Promise.all([
        supabase
          .from('profiles')
          .select('role')
          .neq('role', 'admin'),
        supabase
          .from('trips')
          .select('type'),
        supabase
          .from('bookings')
          .select('status'),
      ]);

      const roleCounts: Record<string, number> = {};
      usersByRole.data?.forEach((u) => {
        roleCounts[u.role] = (roleCounts[u.role] || 0) + 1;
      });

      const typeCounts: Record<string, number> = {};
      tripsByType.data?.forEach((t) => {
        typeCounts[t.type] = (typeCounts[t.type] || 0) + 1;
      });

      const statusCounts: Record<string, number> = {};
      bookingsByStatus.data?.forEach((b) => {
        statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
      });

      return { roleCounts, typeCounts, statusCounts };
    },
  });

  /**
   * Fonction helper pour transformer les données en format ChartData
   */
  const transformToChartData = useMemo(() => {
    return (
      counts: Record<string, number> | undefined,
      labelMap: Record<string, { label: string; color?: string }>,
      useColorFromMap = false
    ): ChartData[] => {
      if (!counts) {
        return [];
      }

      return Object.entries(counts)
        .map(([key, count], index) => {
          if (count <= 0 || !Number.isFinite(count)) {
            return null;
          }

          const info = labelMap[key as keyof typeof labelMap];
          let color = getColorByIndex(index);
          
          if (useColorFromMap && info?.color) {
            color = STATUS_COLOR_MAP[info.color] || color;
          }

          return {
            name: info?.label || key.replace('_', ' '),
            value: count,
            color,
          };
        })
        .filter((item): item is ChartData => item !== null);
    };
  }, []);

  // Transformer les données pour les graphiques avec memoization
  const roleChartData: ChartData[] = useMemo(
    () => transformToChartData(stats?.roleCounts, ROLES),
    [stats?.roleCounts, transformToChartData]
  );

  const tripChartData: ChartData[] = useMemo(
    () => transformToChartData(stats?.typeCounts, TRIP_TYPES),
    [stats?.typeCounts, transformToChartData]
  );

  const bookingChartData: ChartData[] = useMemo(
    () => transformToChartData(stats?.statusCounts, BOOKING_STATUS_LABELS, true),
    [stats?.statusCounts, transformToChartData]
  );

  // Fonction pour rendre un graphique en camembert
  const renderPieChart = (data: ChartData[], title: string, description: string) => {
    if (!data || data.length === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              <p className="text-sm">Aucune donnée disponible</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    // Protection contre division par zéro
    if (total === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              <p className="text-sm">Aucune donnée disponible</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent, value }) => {
                  const percentage = Number.isFinite(percent) ? (percent * 100).toFixed(0) : '0';
                  return `${name}: ${value} (${percentage}%)`;
                }}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.name}-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: unknown, name: string) => {
                  const numValue = typeof value === 'number' ? value : 0;
                  const percentage = total > 0 ? ((numValue / total) * 100).toFixed(1) : '0';
                  return [`${numValue} (${percentage}%)`, name];
                }}
              />
              <Legend
                formatter={(value: string) => {
                  const item = data.find((d) => d.name === value);
                  return item ? `${value} (${item.value})` : value;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-2 h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="mt-2 h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistiques</h1>
        <p className="text-muted-foreground">Analyse détaillée de la plateforme</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {renderPieChart(
          roleChartData,
          'Utilisateurs par rôle',
          'Répartition des utilisateurs'
        )}
        {renderPieChart(
          tripChartData,
          'Trajets par type',
          'Répartition des trajets'
        )}
        {renderPieChart(
          bookingChartData,
          'Réservations par statut',
          'État des réservations'
        )}
      </div>
    </div>
  );
};

export default Statistics;

