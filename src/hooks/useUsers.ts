import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchUsers,
  fetchUserById,
  updateUser,
  verifyUser,
  suspendUser,
  deleteUser,
  getUserStats,
  type Profile,
  type UserFilters,
  type UpdateUserData,
} from '@/services/usersService';
import { toast } from 'sonner';

const QUERY_KEYS = {
  all: ['users'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (filters?: UserFilters) => [...QUERY_KEYS.lists(), filters] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
  stats: (id: string) => [...QUERY_KEYS.detail(id), 'stats'] as const,
};

export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.list(filters),
    queryFn: () => fetchUsers(filters),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: () => fetchUserById(id),
    enabled: !!id,
  });
}

export function useUserStats(userId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.stats(userId),
    queryFn: () => getUserStats(userId),
    enabled: !!userId,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      updateUser(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.detail(id) });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.lists() });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(QUERY_KEYS.detail(id));
      const previousUsers = queryClient.getQueryData(QUERY_KEYS.lists());

      // Optimistically update
      queryClient.setQueryData(QUERY_KEYS.detail(id), (old: Profile | undefined) => 
        old ? { ...old, ...data } : undefined
      );
      queryClient.setQueryData(QUERY_KEYS.lists(), (old: Profile[] | undefined) =>
        old?.map((user) => (user.id === id ? { ...user, ...data } : user))
      );

      return { previousUser, previousUsers };
    },
    onError: (error: Error, variables, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(QUERY_KEYS.detail(variables.id), context.previousUser);
      }
      if (context?.previousUsers) {
        queryClient.setQueryData(QUERY_KEYS.lists(), context.previousUsers);
      }
      toast.error('Erreur lors de la mise à jour', { description: error.message });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      toast.success('Utilisateur mis à jour avec succès');
    },
  });
}

export function useVerifyUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyUser,
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.detail(userId) });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.lists() });

      const previousUser = queryClient.getQueryData(QUERY_KEYS.detail(userId));
      const previousUsers = queryClient.getQueryData(QUERY_KEYS.lists());

      queryClient.setQueryData(QUERY_KEYS.detail(userId), (old: Profile | undefined) => 
        old ? { ...old, verification_status: 'verified' } : undefined
      );
      queryClient.setQueryData(QUERY_KEYS.lists(), (old: Profile[] | undefined) =>
        old?.map((user) =>
          user.id === userId ? { ...user, verification_status: 'verified' } : user
        )
      );

      return { previousUser, previousUsers };
    },
    onError: (error: Error, userId, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(QUERY_KEYS.detail(userId), context.previousUser);
      }
      if (context?.previousUsers) {
        queryClient.setQueryData(QUERY_KEYS.lists(), context.previousUsers);
      }
      toast.error('Erreur lors de la vérification', { description: error.message });
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      toast.success('Utilisateur vérifié avec succès');
    },
  });
}

export function useSuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: suspendUser,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      toast.success('Utilisateur suspendu avec succès');
    },
    onError: (error: Error) => {
      toast.error('Erreur lors de la suspension', { description: error.message });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      toast.success('Utilisateur supprimé avec succès');
    },
    onError: (error: Error) => {
      toast.error('Erreur lors de la suppression', { description: error.message });
    },
  });
}

