export interface RecentUser {
  id: string;
  name: string;
  phone?: string;
  role: string;
  verification_status: string;
  created_at: string;
}

export interface RecentIncident {
  id: string;
  type: string;
  priority: string;
  status: string;
  created_at: string;
  reporter?: {
    name: string;
  } | null;
}

export interface ActivityDataPoint {
  date: string;
  trips: number;
  bookings: number;
}

export interface UserStatusData {
  name: string;
  value: number;
  color: string;
}

