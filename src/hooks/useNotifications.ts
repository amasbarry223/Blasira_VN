import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  type NotificationFilters,
  type CreateNotificationData,
  type Notification,
} from '@/services/notificationsService';
import { toast } from 'sonner';

const QUERY_KEYS = {
  all: ['notifications'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (filters?: NotificationFilters) => [...QUERY_KEYS.lists(), filters] as const,
};

export function useNotifications(filters?: NotificationFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.list(filters),
    queryFn: () => fetchNotifications(filters),
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      toast.success('Notification créée avec succès');
    },
    onError: (error: Error) => {
      toast.error('Erreur lors de la création', { description: error.message });
    },
  });
}

export function useUpdateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Notification> }) =>
      updateNotification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      toast.success('Notification mise à jour avec succès');
    },
    onError: (error: Error) => {
      toast.error('Erreur lors de la mise à jour', { description: error.message });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      toast.success('Notification supprimée avec succès');
    },
    onError: (error: Error) => {
      toast.error('Erreur lors de la suppression', { description: error.message });
    },
  });
}

