import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Trip = Tables<'trips'>;

export interface TripFilters {
  status?: string;
  type?: string;
  departure_name?: string;
  destination_name?: string;
  dateFrom?: string;
  dateTo?: string;
  priceMin?: number;
  priceMax?: number;
}

export interface UpdateTripData {
  status?: string;
  seats_available?: number;
  departure_date?: string;
  departure_time?: string;
  price_per_seat?: number;
}

/**
 * Fetch all trips with optional filters
 */
export async function fetchTrips(filters?: TripFilters) {
  let query = supabase
    .from('trips')
    .select('*, profiles:driver_id(name, phone, avatar_url)');

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  if (filters?.departure_name) {
    query = query.ilike('departure_name', `%${filters.departure_name}%`);
  }

  if (filters?.destination_name) {
    query = query.ilike('destination_name', `%${filters.destination_name}%`);
  }

  if (filters?.dateFrom) {
    query = query.gte('departure_date', filters.dateFrom);
  }

  if (filters?.dateTo) {
    query = query.lte('departure_date', filters.dateTo);
  }

  if (filters?.priceMin !== undefined) {
    query = query.gte('price_per_seat', filters.priceMin);
  }

  if (filters?.priceMax !== undefined) {
    query = query.lte('price_per_seat', filters.priceMax);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Fetch a single trip by ID
 */
export async function fetchTripById(id: string) {
  const { data, error } = await supabase
    .from('trips')
    .select('*, profiles:driver_id(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update trip
 */
export async function updateTrip(id: string, data: UpdateTripData) {
  const { data: updated, error } = await supabase
    .from('trips')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return updated as Trip;
}

/**
 * Cancel trip
 */
export async function cancelTrip(id: string) {
  return updateTrip(id, { status: 'cancelled' });
}

/**
 * Delete trip
 */
export async function deleteTrip(id: string) {
  const { error } = await supabase.from('trips').delete().eq('id', id);
  if (error) throw error;
}

