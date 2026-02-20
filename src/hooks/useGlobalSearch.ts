import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  type: 'user' | 'trip' | 'incident';
  id: string;
  title: string;
  subtitle?: string;
  url: string;
}

export function useGlobalSearch(query: string) {
  return useQuery<SearchResult[]>({
    queryKey: ['global-search', query],
    queryFn: async () => {
      if (!query || query.length < 2) {
        return [];
      }

      const searchTerm = `%${query}%`;
      const results: SearchResult[] = [];

      // Search users
      const { data: users } = await supabase
        .from('profiles')
        .select('id, name, phone, role')
        .or(`name.ilike.${searchTerm},phone.ilike.${searchTerm}`)
        .limit(5);

      if (users) {
        users.forEach((user) => {
          results.push({
            type: 'user',
            id: user.id,
            title: user.name || 'Sans nom',
            subtitle: user.phone || user.role,
            url: `/admin/users?id=${user.id}`,
          });
        });
      }

      // Search trips
      const { data: trips } = await supabase
        .from('trips')
        .select('id, departure_name, destination_name, type')
        .or(`departure_name.ilike.${searchTerm},destination_name.ilike.${searchTerm}`)
        .limit(5);

      if (trips) {
        trips.forEach((trip) => {
          results.push({
            type: 'trip',
            id: trip.id,
            title: `${trip.departure_name} → ${trip.destination_name}`,
            subtitle: trip.type === 'moto' ? 'Moto' : 'Voiture',
            url: `/admin/trips?id=${trip.id}`,
          });
        });
      }

      // Search incidents
      const { data: incidents } = await supabase
        .from('incidents')
        .select('id, type, description')
        .ilike('description', searchTerm)
        .limit(5);

      if (incidents) {
        incidents.forEach((incident) => {
          results.push({
            type: 'incident',
            id: incident.id,
            title: incident.type,
            subtitle: incident.description.substring(0, 50) + '...',
            url: `/admin/incidents?id=${incident.id}`,
          });
        });
      }

      return results;
    },
    enabled: query.length >= 2,
    staleTime: 30000, // 30 seconds
  });
}

