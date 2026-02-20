import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DataTable } from '@/components/admin/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

interface Booking {
  id: string;
  seats_booked: number;
  total_price: number;
  status: string;
  payment_method: string;
  created_at: string;
  trips: { departure_name: string; destination_name: string } | null;
  profiles: { name: string } | null;
}

const Bookings = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: bookings = [] } = useQuery({
    queryKey: ['admin-bookings', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('bookings')
        .select('*, trips(departure_name, destination_name), profiles(name)');
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data } = await query.order('created_at', { ascending: false });
      return data as Booking[];
    },
  });

  const columns: ColumnDef<Booking>[] = [
    {
      id: 'trip',
      header: 'Trajet',
      cell: ({ row }) => (
        <div>
          {row.original.trips ? (
            <div className="font-medium">
              {row.original.trips.departure_name} → {row.original.trips.destination_name}
            </div>
          ) : (
            <span className="text-muted-foreground">Trajet supprimé</span>
          )}
        </div>
      ),
    },
    {
      id: 'passenger',
      header: 'Passager',
      cell: ({ row }) => row.original.profiles?.name || 'Inconnu',
    },
    {
      id: 'seats_booked',
      header: 'Places',
      accessorKey: 'seats_booked',
    },
    {
      id: 'total_price',
      header: 'Prix total',
      cell: ({ row }) => `${row.original.total_price} FCFA`,
    },
    {
      id: 'payment_method',
      header: 'Paiement',
      cell: ({ row }) => {
        const methods: Record<string, string> = {
          orange_money: 'Orange Money',
          moov_money: 'Moov Money',
          cash: 'Espèces',
        };
        return <Badge variant="outline">{methods[row.original.payment_method] || row.original.payment_method}</Badge>;
      },
    },
    {
      id: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const statusColors: Record<string, string> = {
          confirmed: 'bg-green-100 text-green-800',
          pending: 'bg-yellow-100 text-yellow-800',
          completed: 'bg-blue-100 text-blue-800',
          cancelled: 'bg-red-100 text-red-800',
        };
        return (
          <Badge className={statusColors[row.original.status] || ''}>
            {row.original.status}
          </Badge>
        );
      },
    },
    {
      id: 'created_at',
      header: 'Date',
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString('fr-FR'),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Réservations</h1>
          <p className="text-muted-foreground">Gérez toutes les réservations de la plateforme</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="confirmed">Confirmé</SelectItem>
            <SelectItem value="completed">Terminé</SelectItem>
            <SelectItem value="cancelled">Annulé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={bookings}
        columns={columns}
        searchColumnId="id"
        searchPlaceholder="Rechercher une réservation..."
      />
    </div>
  );
};

export default Bookings;

