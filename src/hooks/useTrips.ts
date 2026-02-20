import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTrips,
  fetchTripById,
  updateTrip,
  cancelTrip,
  deleteTrip,
  type Trip,
  type TripFilters,
  type UpdateTripData,
} from '@/services/tripsService';
import { toast } from 'sonner';

const QUERY_KEYS = {
  all: ['trips'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (filters?: TripFilters) => [...QUERY_KEYS.lists(), filters] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
};

export function useTrips(filters?: TripFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.list(filters),
    queryFn: () => fetchTrips(filters),
  });
}

export function useTrip(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: () => fetchTripById(id),
    enabled: !!id,
  });
}

export function useUpdateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTripData }) =>
      updateTrip(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.detail(id) });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.lists() });

      const previousTrip = queryClient.getQueryData(QUERY_KEYS.detail(id));
      const previousTrips = queryClient.getQueryData(QUERY_KEYS.lists());

      queryClient.setQueryData(QUERY_KEYS.detail(id), (old: Trip | undefined) => 
        old ? { ...old, ...data } : undefined
      );
      queryClient.setQueryData(QUERY_KEYS.lists(), (old: Trip[] | undefined) =>
        old?.map((trip) => (trip.id === id ? { ...trip, ...data } : trip))
      );

      return { previousTrip, previousTrips };
    },
    onError: (error: Error, variables, context) => {
      if (context?.previousTrip) {
        queryClient.setQueryData(QUERY_KEYS.detail(variables.id), context.previousTrip);
      }
      if (context?.previousTrips) {
        queryClient.setQueryData(QUERY_KEYS.lists(), context.previousTrips);
      }
      toast.error('Erreur lors de la mise à jour', { description: error.message });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      toast.success('Trajet mis à jour avec succès');
    },
  });
}

export function useCancelTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelTrip,
    onSuccess: (_, tripId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      toast.success('Trajet annulé avec succès');
    },
    onError: (error: Error) => {
      toast.error('Erreur lors de l\'annulation', { description: error.message });
    },
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      toast.success('Trajet supprimé avec succès');
    },
    onError: (error: Error) => {
      toast.error('Erreur lors de la suppression', { description: error.message });
    },
  });
}

