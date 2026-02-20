import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  target_type: 'all' | 'drivers' | 'passengers' | 'specific';
  target_ids: string[];
  type: 'push' | 'email' | 'sms';
  title: string;
  body: string;
  scheduled_at: string | null;
  sent_at: string | null;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateNotificationData {
  target_type: 'all' | 'drivers' | 'passengers' | 'specific';
  target_ids?: string[];
  type: 'push' | 'email' | 'sms';
  title: string;
  body: string;
  scheduled_at?: string | null;
}

export interface NotificationFilters {
  type?: string;
  status?: string;
  target_type?: string;
}

/**
 * Fetch all notifications with optional filters
 */
export async function fetchNotifications(filters?: NotificationFilters) {
  let query = supabase.from('notifications').select('*');

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.target_type) {
    query = query.eq('target_type', filters.target_type);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data as Notification[];
}

/**
 * Create notification
 */
export async function createNotification(data: CreateNotificationData) {
  const { data: created, error } = await supabase
    .from('notifications')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return created as Notification;
}

/**
 * Update notification
 */
export async function updateNotification(id: string, data: Partial<Notification>) {
  const { data: updated, error } = await supabase
    .from('notifications')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return updated as Notification;
}

/**
 * Delete notification
 */
export async function deleteNotification(id: string) {
  const { error } = await supabase.from('notifications').delete().eq('id', id);
  if (error) throw error;
}

