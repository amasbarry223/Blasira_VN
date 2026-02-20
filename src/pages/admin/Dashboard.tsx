import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Car, Calendar, AlertTriangle, ArrowRight } from 'lucide-react';
import { KpiCard } from '@/components/ui/KpiCard';
import { ActivityChart } from '@/components/charts/ActivityChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatDate } from '@/utils/formatters';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { RecentUser, RecentIncident, ActivityDataPoint, UserStatusData } from '@/types/dashboard';

const Dashboard = () => {
  // Fetch statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [usersResult, tripsResult, bookingsResult, incidentsResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('trips').select('id', { count: 'exact' }).eq('status', 'published'),
        supabase.from('bookings').select('id', { count: 'exact' }).eq('status', 'confirmed'),
        supabase.from('incidents').select('id', { count: 'exact' }).neq('status', 'resolved'),
      ]);

      // Get today's bookings
      const today = new Date().toISOString().split('T')[0];
      const { count: todayBookings } = await supabase
        .from('bookings')
        .select('id', { count: 'exact' })
        .eq('status', 'confirmed')
        .gte('created_at', today);

      // Get user growth (last month vs this month)
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const { count: lastMonthUsers } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .lt('created_at', thisMonth.toISOString())
        .gte('created_at', lastMonth.toISOString());

      const { count: thisMonthUsers } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .gte('created_at', thisMonth.toISOString());

      // Calcul de la croissance avec protection contre division par zéro
      const userGrowth = lastMonthUsers && lastMonthUsers > 0
        ? ((thisMonthUsers || 0) - lastMonthUsers) / lastMonthUsers * 100
        : thisMonthUsers && thisMonthUsers > 0
        ? 100 // 100% de croissance si pas de données le mois dernier
        : 0;

      return {
        totalUsers: usersResult.count || 0,
        activeTrips: tripsResult.count || 0,
        todayBookings: todayBookings || 0,
        unresolvedIncidents: incidentsResult.count || 0,
        userGrowth,
      };
    },
  });

  // Fetch activity data for last 30 days - With fallback if RPC fails
  const { data: activityData, isLoading: activityLoading } = useQuery<ActivityDataPoint[]>({
    queryKey: ['admin-activity'],
    queryFn: async () => {
      // Try RPC function first
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_activity_data', { days_count: 30 });
      
      if (!rpcError && rpcData && rpcData.length > 0) {
        // Transform the data to match the expected format
        return rpcData.map((item: { date: string; trips_count: number; bookings_count: number }) => ({
          date: formatDate(new Date(item.date), 'dd/MM'),
          trips: Number(item.trips_count) || 0,
          bookings: Number(item.bookings_count) || 0,
        }));
      }

      // Fallback: Generate data directly from tables
      if (process.env.NODE_ENV === 'development') {
        console.warn('RPC function not available, using fallback method');
      }
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);
      
      // Generate array of dates for last 30 days
      const dates: string[] = [];
      const dateMap = new Map<string, { trips: number; bookings: number }>();
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        dates.push(dateStr);
        dateMap.set(dateStr, { trips: 0, bookings: 0 });
      }

      // Fetch trips data
      const { data: tripsData } = await supabase
        .from('trips')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      // Fetch bookings data
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      // Count trips per day
      tripsData?.forEach((trip) => {
        const tripDate = new Date(trip.created_at).toISOString().split('T')[0];
        const dayData = dateMap.get(tripDate);
        if (dayData) {
          dayData.trips += 1;
        }
      });

      // Count bookings per day
      bookingsData?.forEach((booking) => {
        const bookingDate = new Date(booking.created_at).toISOString().split('T')[0];
        const dayData = dateMap.get(bookingDate);
        if (dayData) {
          dayData.bookings += 1;
        }
      });

      // Transform to ActivityDataPoint format
      return dates.map((dateStr) => {
        const dayData = dateMap.get(dateStr) || { trips: 0, bookings: 0 };
        return {
          date: formatDate(new Date(dateStr), 'dd/MM'),
          trips: dayData.trips,
          bookings: dayData.bookings,
        };
      });
    },
  });

  // Fetch user status distribution
  const { data: userStatusData, isLoading: statusLoading } = useQuery({
    queryKey: ['admin-user-status'],
    queryFn: async () => {
      const [active, pending, suspended] = await Promise.all([
        supabase
          .from('profiles')
          .select('id', { count: 'exact' })
          .eq('verification_status', 'verified'),
        supabase
          .from('profiles')
          .select('id', { count: 'exact' })
          .eq('verification_status', 'pending'),
        supabase
          .from('profiles')
          .select('id', { count: 'exact' })
          .eq('verification_status', 'rejected'),
      ]);

      return [
        { name: 'Actifs', value: active.count || 0, color: 'hsl(var(--blasira-success))' },
        { name: 'En attente', value: pending.count || 0, color: 'hsl(var(--blasira-warning))' },
        { name: 'Suspendus', value: suspended.count || 0, color: 'hsl(var(--blasira-danger))' },
      ];
    },
  });

  // Fetch recent users
  const { data: recentUsers } = useQuery<RecentUser[]>({
    queryKey: ['admin-recent-users'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, name, phone, role, verification_status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      return data;
    },
  });

  // Fetch recent incidents
  const { data: recentIncidents } = useQuery<RecentIncident[]>({
    queryKey: ['admin-recent-incidents'],
    queryFn: async () => {
      const { data } = await supabase
        .from('incidents')
        .select('id, type, priority, status, created_at, reporter:reporter_id(name)')
        .order('created_at', { ascending: false })
        .limit(5);
      return data;
    },
  });

  const isLoading = statsLoading || activityLoading || statusLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de la plateforme Blasira</p>
      </div>

      {/* Alerts */}
      {stats && stats.unresolvedIncidents > 5 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Incidents non résolus</AlertTitle>
          <AlertDescription>
            {stats.unresolvedIncidents} incident(s) non résolu(s) nécessitent votre attention
          </AlertDescription>
        </Alert>
      )}

      {/* KPIs - Ligne 1 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Utilisateurs totaux"
          value={stats?.totalUsers || 0}
          change={stats?.userGrowth}
          icon={Users}
          color="primary"
          isLoading={statsLoading}
          description="vs mois dernier"
        />
        <KpiCard
          title="Trajets actifs"
          value={stats?.activeTrips || 0}
          icon={Car}
          color="success"
          isLoading={statsLoading}
          description="Trajets en cours aujourd'hui"
        />
        <KpiCard
          title="Réservations du jour"
          value={stats?.todayBookings || 0}
          icon={Calendar}
          color="secondary"
          isLoading={statsLoading}
          description="Confirmées / En attente"
        />
        <KpiCard
          title="Incidents non résolus"
          value={stats?.unresolvedIncidents || 0}
          icon={AlertTriangle}
          color={stats && stats.unresolvedIncidents > 5 ? 'danger' : 'warning'}
          isLoading={statsLoading}
          description="Nécessitent une attention"
        />
      </div>

      {/* Graphiques - Ligne 2 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityChart
            data={activityData || []}
            title="Activité des 30 derniers jours"
            description="Évolution des trajets et réservations"
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Statuts utilisateurs</CardTitle>
            <CardDescription>Répartition par statut</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={userStatusData || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(userStatusData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tableaux récents - Ligne 3 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Derniers utilisateurs</CardTitle>
              <CardDescription>5 derniers utilisateurs inscrits</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/users">
                Voir tout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentUsers && recentUsers.length > 0 ? (
              <div className="space-y-4">
                {recentUsers.map((user: RecentUser) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{user.name || 'Sans nom'}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.phone || 'Sans téléphone'} • {user.role}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(user.created_at)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun utilisateur récent</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Derniers incidents</CardTitle>
              <CardDescription>5 derniers incidents signalés</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/incidents">
                Voir tout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentIncidents && recentIncidents.length > 0 ? (
              <div className="space-y-4">
                {recentIncidents.map((incident: RecentIncident) => (
                  <div
                    key={incident.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{incident.type}</p>
                      <p className="text-sm text-muted-foreground">
                        Par {incident.reporter?.name || 'Inconnu'} • Priorité: {incident.priority}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(incident.created_at)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun incident récent</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
