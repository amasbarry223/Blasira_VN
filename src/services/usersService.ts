import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Profile = Tables<'profiles'>;

export interface UserFilters {
  status?: string;
  role?: string;
  verification_status?: string;
  search?: string;
}

export interface UpdateUserData {
  name?: string;
  phone?: string;
  university?: string;
  role?: string;
  verification_status?: string;
  rating?: number;
  total_trips?: number;
}

/**
 * Fetch all users with optional filters
 */
export async function fetchUsers(filters?: UserFilters) {
  let query = supabase.from('profiles').select('*');

  if (filters?.status) {
    // Status filter logic (if needed)
  }

  if (filters?.role) {
    query = query.eq('role', filters.role);
  }

  if (filters?.verification_status) {
    query = query.eq('verification_status', filters.verification_status);
  }

  if (filters?.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data as Profile[];
}

/**
 * Fetch a single user by ID
 */
export async function fetchUserById(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Profile;
}

/**
 * Update user
 */
export async function updateUser(id: string, data: UpdateUserData) {
  const { data: updated, error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return updated as Profile;
}

/**
 * Verify user account
 */
export async function verifyUser(id: string) {
  return updateUser(id, { verification_status: 'verified' });
}

/**
 * Suspend user account
 */
export async function suspendUser(id: string) {
  // You might want to add a suspended status or use a different approach
  return updateUser(id, { verification_status: 'rejected' });
}

/**
 * Delete user
 */
export async function deleteUser(id: string) {
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) throw error;
}

/**
 * Get user statistics
 */
export async function getUserStats(userId: string) {
  const [tripsResult, bookingsResult] = await Promise.all([
    supabase
      .from('trips')
      .select('id', { count: 'exact' })
      .eq('driver_id', userId),
    supabase
      .from('bookings')
      .select('id', { count: 'exact' })
      .eq('passenger_id', userId),
  ]);

  return {
    tripsCount: tripsResult.count || 0,
    bookingsCount: bookingsResult.count || 0,
  };
}

