import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Car, Bike } from 'lucide-react';
import TripCard from '@/components/TripCard';
import Section from '@/components/layout/Section';
import { useQuery } from '@tanstack/react-query';
import { fetchTrips } from '@/lib/api';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const type = searchParams.get('type') || 'all';

  const [vehicleFilter, setVehicleFilter] = useState<string>(type);
  const [sortBy, setSortBy] = useState<'price' | 'time' | 'rating'>('time');

  const { data: trips = [], isLoading } = useQuery({
    queryKey: ['trips', from, to, vehicleFilter],
    queryFn: () => fetchTrips({ from, to, type: vehicleFilter }),
  });

  const sorted = useMemo(() => {
    const arr = [...trips];
    arr.sort((a, b) => {
      if (sortBy === 'price') return a.price_per_seat - b.price_per_seat;
      if (sortBy === 'rating') return (b.driver?.rating ?? 0) - (a.driver?.rating ?? 0);
      return a.departure_time.localeCompare(b.departure_time);
    });
    return arr;
  }, [trips, sortBy]);

  return (
    <div className="pb-20 md:pb-8">
      {/* Section Header - Titre et Stats avec fond différencié */}
      <Section spacing="sm" className="bg-muted/30 border-b border-border/50">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold md:text-3xl">
            {from && to ? `${from} → ${to}` : 'Tous les trajets'}
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            {sorted.length} trajet{sorted.length > 1 ? 's' : ''} disponible{sorted.length > 1 ? 's' : ''}
          </p>
        </div>
      </Section>

      {/* Section Filtres - Barre distincte avec fond et bordure */}
      <Section spacing="sm" className="bg-background">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {[
                { value: 'all', label: 'Tous', icon: null },
                { value: 'voiture', label: 'Voiture', icon: Car },
                { value: 'moto', label: 'Moto', icon: Bike },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setVehicleFilter(value)}
                  aria-pressed={vehicleFilter === value}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    vehicleFilter === value
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                  {label}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground hidden sm:inline">Trier par:</span>
              {(['time', 'price', 'rating'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  aria-pressed={sortBy === s}
                  aria-label={`Trier par ${s === 'time' ? 'heure' : s === 'price' ? 'prix' : 'note'}`}
                  className={`rounded-full px-3 py-2 text-xs font-medium transition-all ${
                    sortBy === s 
                      ? 'bg-secondary text-secondary-foreground shadow-sm' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {s === 'time' ? '🕐' : s === 'price' ? '💰' : '⭐'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Section Résultats - Contenu principal avec séparateur visuel */}
      <Section spacing="md" className="bg-background">
        <div className="mb-6 border-t border-border/50 pt-6">
          <h2 className="mb-1 text-lg font-semibold text-foreground md:text-xl">
            Résultats de recherche
          </h2>
          <p className="text-xs text-muted-foreground md:text-sm">
            Sélectionnez un trajet pour voir les détails
          </p>
        </div>

        {isLoading ? (
          <div className="py-16 text-center">
            <p className="text-base text-muted-foreground">Chargement des trajets...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="py-16 text-center">
            <p className="mb-2 text-base font-medium text-foreground">Aucun trajet trouvé</p>
            <p className="text-sm text-muted-foreground">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((trip, i) => (
              <TripCard key={trip.id} trip={trip} index={i} />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
};

export default SearchResults;
