import { supabase } from '@/integrations/supabase/client';

export interface Incident {
  id: string;
  reporter_id: string;
  reported_user_id: string | null;
  trip_id: string | null;
  type: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'in_progress' | 'resolved' | 'archived';
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
}

export interface CreateIncidentData {
  reporter_id: string;
  reported_user_id?: string | null;
  trip_id?: string | null;
  type: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface UpdateIncidentData {
  status?: 'new' | 'in_progress' | 'resolved' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
}

export interface IncidentFilters {
  status?: string;
  type?: string;
  priority?: string;
}

/**
 * Fetch all incidents with optional filters
 */
export async function fetchIncidents(filters?: IncidentFilters) {
  let query = supabase
    .from('incidents')
    .select(
      '*, reporter:reporter_id(name, avatar_url, phone), reported_user:reported_user_id(name, avatar_url, phone), trip:trip_id(id, departure_name, destination_name)'
    );

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  if (filters?.priority) {
    query = query.eq('priority', filters.priority);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data as Incident[];
}

/**
 * Fetch a single incident by ID
 */
export async function fetchIncidentById(id: string) {
  const { data, error } = await supabase
    .from('incidents')
    .select(
      '*, reporter:reporter_id(name, avatar_url, phone), reported_user:reported_user_id(name, avatar_url, phone), trip:trip_id(id, departure_name, destination_name, departure_date, departure_time)'
    )
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Incident;
}

/**
 * Create incident
 */
export async function createIncident(data: CreateIncidentData) {
  const { data: created, error } = await supabase
    .from('incidents')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return created as Incident;
}

/**
 * Update incident
 */
export async function updateIncident(id: string, data: UpdateIncidentData) {
  const updateData: UpdateIncidentData & { resolved_at?: string } = { ...data };
  
  // If resolving, set resolved_at and resolved_by
  if (data.status === 'resolved') {
    updateData.resolved_at = new Date().toISOString();
    // resolved_by should be set from the current admin user
  }

  const { data: updated, error } = await supabase
    .from('incidents')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return updated as Incident;
}

/**
 * Resolve incident
 */
export async function resolveIncident(id: string, resolvedBy: string) {
  return updateIncident(id, {
    status: 'resolved',
  });
}

/**
 * Delete incident
 */
export async function deleteIncident(id: string) {
  const { error } = await supabase.from('incidents').delete().eq('id', id);
  if (error) throw error;
}

