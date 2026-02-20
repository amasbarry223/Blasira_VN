import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Star, Shield, Car, Bike, Users, Phone, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { fetchTripById, createBooking } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [seats, setSeats] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'orange_money' | 'moov_money'>('cash');
  const [booking, setBooking] = useState(false);

  const { data: trip, isLoading } = useQuery({
    queryKey: ['trip', id],
    queryFn: () => fetchTripById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Trajet introuvable</p>
      </div>
    );
  }

  const isMoto = trip.type === 'moto';
  const VehicleIcon = isMoto ? Bike : Car;
  const totalPrice = trip.price_per_seat * seats;

  const handleConfirm = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setBooking(true);
    try {
      await createBooking({
        trip_id: trip.id,
        passenger_id: user.id,
        seats_booked: seats,
        total_price: totalPrice,
        payment_method: paymentMethod,
      });
      toast.success('🎉 Réservation confirmée !', {
        description: `${trip.departure_name} → ${trip.destination_name}`,
      });
      setShowConfirm(false);
      navigate('/my-trips');
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue');
      toast.error(error.message || 'Erreur lors de la réservation');
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="pb-20">
      <div className="container py-3">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Retour
        </button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isMoto ? 'bg-secondary/30 text-secondary-foreground' : 'bg-primary/10 text-primary'}`}>
            <VehicleIcon className="h-4 w-4" />
            {isMoto ? 'MOTO' : 'VOITURE'} • {trip.vehicle_info}
          </span>
          {isMoto && trip.helmet_provided && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-[11px] font-medium text-success">
              <Shield className="h-3 w-3" /> Casque fourni
            </span>
          )}
        </div>

        {/* Route card */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex flex-col items-center gap-1">
              <div className="h-3 w-3 rounded-full border-2 border-primary bg-primary/20" />
              <div className="h-10 w-0.5 bg-border" />
              <div className="h-3 w-3 rounded-full border-2 border-mali-red bg-mali-red/20" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <div className="text-xs text-muted-foreground">Départ</div>
                <div className="font-semibold">{trip.departure_name}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Arrivée</div>
                <div className="font-semibold">{trip.destination_name}</div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{trip.departure_time}</span>
            <span>⏱️ {trip.duration_min} min</span>
            <span>{trip.distance_km} km</span>
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{trip.seats_available} place{trip.seats_available > 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Driver card */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <img src={trip.driver.avatar_url || `https://ui-avatars.com/api/?name=${trip.driver.name}`} alt={trip.driver.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/20" />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">{trip.driver.name}</span>
                {trip.driver.verification_status === 'verified' && <Shield className="h-4 w-4 text-primary" />}
              </div>
              <div className="text-xs text-muted-foreground">{trip.driver.university}</div>
              <div className="mt-1 flex items-center gap-2 text-xs">
                <span className="flex items-center gap-0.5"><Star className="h-3.5 w-3.5 fill-mali-gold text-mali-gold" />{trip.driver.rating}</span>
                <span className="text-muted-foreground">• {trip.driver.total_trips} trajets</span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-muted-foreground hover:bg-muted">
              <Phone className="h-3.5 w-3.5" /> Appeler
            </button>
            <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-primary hover:bg-primary/5">
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </button>
          </div>
        </div>

        {/* Price + booking */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 text-center">
            <div className="text-3xl font-bold text-primary">{trip.price_per_seat} <span className="text-base">FCFA</span></div>
            <div className="text-xs text-muted-foreground">par personne</div>
          </div>
          <div className="mb-4">
            <div className="mb-1 text-xs font-medium text-muted-foreground">Nombre de places</div>
            <div className="flex gap-2">
              {Array.from({ length: trip.seats_available }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setSeats(n)} className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${seats === n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                  {n}
                </button>
              ))}
            </div>
            {seats > 1 && (
              <div className="mt-1 text-right text-xs text-muted-foreground">Total: <span className="font-semibold text-foreground">{totalPrice} FCFA</span></div>
            )}
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => user ? setShowConfirm(true) : navigate('/auth')} className="w-full rounded-xl bg-gradient-mali py-3.5 text-sm font-bold text-primary-foreground shadow-mali">
            Réserver {seats} place{seats > 1 ? 's' : ''} • {totalPrice} FCFA
          </motion.button>
        </div>
      </motion.div>

      {/* Confirmation modal */}
      {showConfirm && (
      <div className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/50 md:items-center">
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="w-full max-w-md max-h-[85vh] flex flex-col rounded-t-2xl bg-card md:rounded-2xl">
            <div className="overflow-y-auto flex-1 p-6 pb-0">
              <h3 className="mb-4 text-base font-bold">Confirmer votre réservation</h3>
              <div className="mb-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Trajet</span><span className="font-medium">{trip.departure_name} → {trip.destination_name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{trip.departure_date} à {trip.departure_time}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Conducteur</span><span>{trip.driver.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Places</span><span>{seats}</span></div>
                <div className="flex justify-between font-semibold"><span>Total</span><span className="text-primary">{totalPrice} FCFA</span></div>
              </div>
              <div className="mb-4">
                <div className="mb-2 text-xs font-medium">Mode de paiement</div>
                <div className="space-y-2">
                  {([
                    { value: 'cash' as const, label: '💵 Espèces au conducteur' },
                    { value: 'orange_money' as const, label: '🟠 Orange Money' },
                    { value: 'moov_money' as const, label: '🔵 Moov Money' },
                  ]).map(({ value, label }) => (
                    <button key={value} onClick={() => setPaymentMethod(value)} className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${paymentMethod === value ? 'border-primary bg-primary/5 font-medium' : 'border-border hover:bg-muted'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-3 border-t border-border">
              <button onClick={() => setShowConfirm(false)} className="flex-1 rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground">Annuler</button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleConfirm} disabled={booking} className="flex-1 rounded-xl bg-gradient-mali py-3 text-sm font-bold text-primary-foreground shadow-mali disabled:opacity-50">
                {booking ? '...' : 'Confirmer'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TripDetail;
