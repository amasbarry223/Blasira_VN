import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchIncidents,
  fetchIncidentById,
  createIncident,
  updateIncident,
  resolveIncident,
  deleteIncident,
  type Incident,
  type IncidentFilters,
  type CreateIncidentData,
  type UpdateIncidentData,
} from '@/services/incidentsService';
import { toast } from 'sonner';

const QUERY_KEYS = {
  all: ['incidents'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (filters?: IncidentFilters) => [...QUERY_KEYS.lists(), filters] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
};

export function useIncidents(filters?: IncidentFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.list(filters),
    queryFn: () => fetchIncidents(filters),
  });
}

export function useIncident(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: () => fetchIncidentById(id),
    enabled: !!id,
  });
}

export function useCreateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      toast.success('Incident créé avec succès');
    },
    onError: (error: Error) => {
      toast.error('Erreur lors de la création', { description: error.message });
    },
  });
}

export function useUpdateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIncidentData }) =>
      updateIncident(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.detail(id) });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.lists() });

      const previousIncident = queryClient.getQueryData(QUERY_KEYS.detail(id));
      const previousIncidents = queryClient.getQueryData(QUERY_KEYS.lists());

      queryClient.setQueryData(QUERY_KEYS.detail(id), (old: Incident | undefined) => 
        old ? { ...old, ...data } : undefined
      );
      queryClient.setQueryData(QUERY_KEYS.lists(), (old: Incident[] | undefined) =>
        old?.map((incident) => (incident.id === id ? { ...incident, ...data } : incident))
      );

      return { previousIncident, previousIncidents };
    },
    onError: (error: Error, variables, context) => {
      if (context?.previousIncident) {
        queryClient.setQueryData(QUERY_KEYS.detail(variables.id), context.previousIncident);
      }
      if (context?.previousIncidents) {
        queryClient.setQueryData(QUERY_KEYS.lists(), context.previousIncidents);
      }
      toast.error('Erreur lors de la mise à jour', { description: error.message });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      toast.success('Incident mis à jour avec succès');
    },
  });
}

export function useResolveIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, resolvedBy }: { id: string; resolvedBy: string }) =>
      resolveIncident(id, resolvedBy),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      toast.success('Incident résolu avec succès');
    },
    onError: (error: Error) => {
      toast.error('Erreur lors de la résolution', { description: error.message });
    },
  });
}

export function useDeleteIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      toast.success('Incident supprimé avec succès');
    },
    onError: (error: Error) => {
      toast.error('Erreur lors de la suppression', { description: error.message });
    },
  });
}

