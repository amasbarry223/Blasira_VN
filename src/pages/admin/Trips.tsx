import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTrips, useUpdateTrip, useCancelTrip, useDeleteTrip } from '@/hooks/useTrips';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatDate, formatPrice } from '@/utils/formatters';
import { TRIP_TYPES, TRIP_STATUS_LABELS } from '@/utils/constants';
import { Eye, XCircle, Trash2, Car, Bike } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

interface Trip {
  id: string;
  departure_name: string;
  destination_name: string;
  type: string;
  status: string;
  seats_available: number;
  seats_total: number;
  price_per_seat: number;
  departure_date: string;
  departure_time: string;
  created_at: string;
  profiles?: { name: string } | null;
}

const Trips = () => {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [tripToCancel, setTripToCancel] = useState<Trip | null>(null);
  const { tripFilters, setTripFilters, clearTripFilters } = useAdminStore();

  const filters = {
    status: tripFilters.status === 'all' ? undefined : tripFilters.status,
    type: tripFilters.type === 'all' ? undefined : tripFilters.type,
    departure_name: tripFilters.city,
    priceMin: tripFilters.priceMin,
    priceMax: tripFilters.priceMax,
  };

  const { data: tripsData, isLoading } = useTrips(filters);
  const trips = tripsData || [];
  const { mutate: updateTrip, isPending: isUpdating } = useUpdateTrip();
  const { mutate: cancelTrip, isPending: isCancelling } = useCancelTrip();
  const { mutate: deleteTrip, isPending: isDeleting } = useDeleteTrip();

  const handleViewTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (trip: Trip) => {
    setTripToDelete(trip);
    setDeleteDialogOpen(true);
  };

  const handleCancel = (trip: Trip) => {
    setTripToCancel(trip);
    setCancelDialogOpen(true);
  };

  const columns: ColumnDef<Trip>[] = [
    {
      accessorKey: 'departure_name',
      header: 'Départ → Arrivée',
      cell: ({ row }) => {
        const trip = row.original;
        return (
          <div>
            <div className="font-medium">
              {trip.departure_name} → {trip.destination_name}
            </div>
            <div className="text-sm text-muted-foreground">
              Par {trip.profiles?.name || 'Inconnu'}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'departure_date',
      header: 'Date / Heure',
      cell: ({ row }) => {
        const trip = row.original;
        return (
          <div>
            <div className="font-medium">{formatDate(trip.departure_date)}</div>
            <div className="text-sm text-muted-foreground">{trip.departure_time}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        const Icon = type === 'moto' ? Bike : Car;
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span>{TRIP_TYPES[type as keyof typeof TRIP_TYPES]?.label || type}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'seats_available',
      header: 'Places',
      cell: ({ row }) => {
        const trip = row.original;
        return (
          <span>
            {trip.seats_available} / {trip.seats_total}
          </span>
        );
      },
    },
    {
      accessorKey: 'price_per_seat',
      header: 'Prix',
      cell: ({ row }) => {
        const price = row.getValue('price_per_seat') as number;
        return <span className="font-medium">{formatPrice(price)}</span>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return <StatusBadge status={status as 'published' | 'full' | 'completed' | 'cancelled'} />;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const trip = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleViewTrip(trip)}
              aria-label="Voir les détails"
            >
              <Eye className="h-4 w-4" />
            </Button>
            {trip.status !== 'cancelled' && trip.status !== 'completed' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCancel(trip)}
                aria-label="Annuler"
              >
                <XCircle className="h-4 w-4 text-orange-600" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(trip)}
              aria-label="Supprimer"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trajets</h1>
          <p className="text-muted-foreground">Gérez tous les trajets de la plateforme</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select
                value={tripFilters.status || 'all'}
                onValueChange={(value) => setTripFilters({ status: value === 'all' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                  <SelectItem value="full">Complet</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={tripFilters.type || 'all'}
                onValueChange={(value) => setTripFilters({ type: value === 'all' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="voiture">Voiture</SelectItem>
                  <SelectItem value="moto">Moto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ville / Quartier</Label>
              <Input
                placeholder="Départ ou destination..."
                value={tripFilters.city || ''}
                onChange={(e) => setTripFilters({ city: e.target.value || undefined })}
              />
            </div>
            <div className="space-y-2">
              <Label>Prix (FCFA)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={tripFilters.priceMin || ''}
                  onChange={(e) => setTripFilters({ priceMin: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-24"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={tripFilters.priceMax || ''}
                  onChange={(e) => setTripFilters({ priceMax: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-24"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                variant="outline"
                className="w-full"
                onClick={clearTripFilters}
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={trips}
        searchColumnId="departure_name"
        searchPlaceholder="Rechercher par départ..."
        isLoading={isLoading}
        enableExport
      />

      {/* Trip Detail Modal */}
      {selectedTrip && isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsDetailModalOpen(false)}>
          <Card className="max-w-2xl max-h-[90vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
          <CardHeader>
            <CardTitle>Détails du trajet</CardTitle>
            <CardDescription>
              {selectedTrip.departure_name} → {selectedTrip.destination_name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Conducteur</Label>
                <p>{selectedTrip.profiles?.name || 'Inconnu'}</p>
              </div>
              <div>
                <Label>Type</Label>
                <p>{TRIP_TYPES[selectedTrip.type as keyof typeof TRIP_TYPES]?.label}</p>
              </div>
              <div>
                <Label>Date</Label>
                <p>{formatDate(selectedTrip.departure_date)}</p>
              </div>
              <div>
                <Label>Heure</Label>
                <p>{selectedTrip.departure_time}</p>
              </div>
              <div>
                <Label>Places</Label>
                <p>
                  {selectedTrip.seats_available} / {selectedTrip.seats_total}
                </p>
              </div>
              <div>
                <Label>Prix par place</Label>
                <p>{formatPrice(selectedTrip.price_per_seat)}</p>
              </div>
              <div>
                <Label>Statut</Label>
                <StatusBadge status={selectedTrip.status as 'published' | 'full' | 'completed' | 'cancelled'} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                Fermer
              </Button>
              {selectedTrip.status !== 'cancelled' && selectedTrip.status !== 'completed' && (
                <Button variant="outline" onClick={() => handleCancel(selectedTrip)}>
                  Annuler le trajet
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        </div>
      )}

      {/* Cancel Confirmation */}
      <ConfirmDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title="Annuler le trajet"
        description={`Êtes-vous sûr de vouloir annuler ce trajet ? Le conducteur sera notifié automatiquement.`}
        onConfirm={() => {
          if (tripToCancel) {
            cancelTrip(tripToCancel.id);
            setCancelDialogOpen(false);
            setTripToCancel(null);
          }
        }}
        variant="default"
        confirmLabel="Annuler le trajet"
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Supprimer le trajet"
        description={`Êtes-vous sûr de vouloir supprimer ce trajet ? Cette action est irréversible.`}
        onConfirm={() => {
          if (tripToDelete) {
            deleteTrip(tripToDelete.id);
            setDeleteDialogOpen(false);
            setTripToDelete(null);
          }
        }}
        variant="destructive"
        confirmLabel="Supprimer"
      />
    </div>
  );
};

export default Trips;
