import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Car, Bike, ArrowLeft, Check } from 'lucide-react';
import { quartiers, universities } from '@/lib/api';
import { vehicleModels, calculateBasePrice, calculateTotalPrice, getDriverBreakdown } from '@/lib/pricing';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { createTrip } from '@/lib/api';

const steps = ['Itinéraire', 'Horaire', 'Véhicule', 'Prix', 'Récap'];

const PublishTrip = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [form, setForm] = useState({
    university: '',
    departure: '',
    destination: '',
    date: '',
    time: '07:30',
    recurrent: false,
    days: [] as string[],
    type: '' as 'voiture' | 'moto' | '',
    vehicle_info: '',
    seats: 2,
    helmet: false,
    price: 0,
  });

  const distance = form.departure && form.destination ? Math.floor(Math.random() * 10 + 5) : 0;

  // Auto-calculate price based on distance and vehicle type
  const autoBasePrice = form.type && distance > 0 ? calculateBasePrice(distance, form.type) : 0;
  const autoTotalPrice = autoBasePrice > 0 ? calculateTotalPrice(autoBasePrice) : 0;
  const driverBreakdown = form.price > 0 ? getDriverBreakdown(form.price) : null;

  const canNext = () => {
    if (step === 0) return form.departure && form.destination;
    if (step === 1) return form.date && form.time;
    if (step === 2) return form.type && form.vehicle_info;
    if (step === 3) return form.price >= 100 && form.price <= 2000;
    return true;
  };

  const handlePublish = async () => {
    if (!user || !form.type) return;
    setPublishing(true);
    try {
      await createTrip({
        driver_id: user.id,
        type: form.type,
        departure_name: form.departure,
        destination_name: form.destination,
        departure_date: form.date,
        departure_time: form.time,
        seats_available: form.seats,
        seats_total: form.seats,
        price_per_seat: form.price,
        duration_min: Math.round(distance * 2.5),
        distance_km: distance,
        recurrent: form.recurrent ? 'weekly' : null,
        status: 'published',
        helmet_provided: form.helmet,
        vehicle_info: form.vehicle_info,
      });
      toast.success('✅ Trajet publié avec succès !', { description: `${form.departure} → ${form.destination}` });
      navigate('/my-trips');
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue');
      toast.error(error.message || 'Erreur lors de la publication');
    } finally {
      setPublishing(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">📍 Itinéraire</h2>
            {/* Departure - Quartier */}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Quartier de départ</label>
              <select
                value={form.departure}
                onChange={(e) => setForm({ ...form, departure: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
              >
                <option value="">Sélectionner un quartier</option>
                {quartiers.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>
            {/* Destination - Université */}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Université / Établissement d'arrivée</label>
              <select
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value, university: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
              >
                <option value="">Sélectionner une université</option>
                {universities.map((uni) => (
                  <option key={uni} value={uni}>🎓 {uni}</option>
                ))}
              </select>
            </div>
            {distance > 0 && (
              <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">📏 ~{distance} km • ⏱️ ~{Math.round(distance * 2.5)} min estimé</div>
            )}
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">📅 Horaire</h2>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} min={new Date().toISOString().split('T')[0]} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Heure de départ</label>
              <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.recurrent} onChange={(e) => setForm({ ...form, recurrent: e.target.checked })} className="h-4 w-4 rounded accent-primary" />
              Trajet récurrent
            </label>
            {form.recurrent && (
              <div className="flex flex-wrap gap-2">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((d) => (
                  <button key={d} onClick={() => setForm({ ...form, days: form.days.includes(d) ? form.days.filter((x) => x !== d) : [...form.days, d] })} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${form.days.includes(d) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">🚗 Véhicule</h2>
            <div className="flex gap-3">
              {[
                { value: 'voiture' as const, label: 'Voiture', icon: Car },
                { value: 'moto' as const, label: 'Moto', icon: Bike },
              ].map(({ value, label, icon: Icon }) => (
                <button key={value} onClick={() => setForm({ ...form, type: value, seats: value === 'moto' ? 1 : 3, vehicle_info: '' })} className={`flex flex-1 flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors ${form.type === value ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <Icon className={`h-8 w-8 ${form.type === value ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>

            {/* Predefined vehicle models */}
            {form.type && (
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">Modèle du véhicule</label>
                <div className="grid gap-2">
                  {vehicleModels[form.type].map((model) => (
                    <button
                      key={model.value}
                      onClick={() => setForm({ ...form, vehicle_info: model.value })}
                      className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-colors ${
                        form.vehicle_info === model.value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      {form.type === 'moto' ? '🏍️' : '🚗'} {model.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Places disponibles</label>
              <div className="flex gap-2">
                {(form.type === 'moto' ? [1, 2] : [1, 2, 3, 4]).map((n) => (
                  <button key={n} onClick={() => setForm({ ...form, seats: n })} className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${form.seats === n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            {form.type === 'moto' && (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.helmet} onChange={(e) => setForm({ ...form, helmet: e.target.checked })} className="h-4 w-4 rounded accent-primary" />
                🪖 Casque fourni
              </label>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">💰 Prix par place</h2>
            {autoTotalPrice > 0 && (
              <button
                onClick={() => setForm({ ...form, price: autoTotalPrice })}
                className="w-full rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 py-3 text-center"
              >
                <div className="text-xs text-muted-foreground">Prix calculé automatiquement</div>
                <div className="text-xl font-bold text-primary">{autoTotalPrice} FCFA</div>
                <div className="text-[10px] text-muted-foreground">Cliquez pour appliquer</div>
              </button>
            )}
            <div>
              <input type="number" min={100} max={2000} step={50} value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="Prix en FCFA" className="w-full rounded-xl border border-border bg-background px-3 py-3 text-center text-2xl font-bold" />
              <div className="mt-2 text-center text-xs text-muted-foreground">Min: 100 FCFA — Max: 2 000 FCFA</div>
            </div>

            {/* Driver-only breakdown */}
            {driverBreakdown && (
              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">💼 Votre détail conducteur</div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Prix affiché au passager</span>
                  <span className="font-semibold">{driverBreakdown.totalPrice} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Commission Blasira (15%)</span>
                  <span className="font-semibold text-mali-red">-{driverBreakdown.commission} FCFA</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between text-sm">
                  <span className="font-bold">Vous recevez</span>
                  <span className="font-bold text-primary">{driverBreakdown.driverNet} FCFA</span>
                </div>
                {form.seats > 1 && (
                  <div className="text-[11px] text-center text-muted-foreground">
                    Gains max: <span className="font-semibold text-primary">{driverBreakdown.driverNet * form.seats} FCFA</span> ({form.seats} places)
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-3">
            <h2 className="text-lg font-bold">📋 Récapitulatif</h2>
            <div className="space-y-2 rounded-xl border border-border bg-card p-4 text-sm">
              <Row label="Établissement" value={`🎓 ${form.university}`} />
              <Row label="Trajet" value={`${form.departure} → ${form.destination}`} />
              <Row label="Date" value={`${form.date} à ${form.time}`} />
              {form.recurrent && <Row label="Récurrence" value={form.days.join(', ')} />}
              <Row label="Véhicule" value={`${form.type === 'moto' ? '🏍️' : '🚗'} ${form.vehicle_info}`} />
              <Row label="Places" value={`${form.seats}`} />
              <Row label="Prix/place" value={`${form.price} FCFA`} />
              {form.type === 'moto' && <Row label="Casque" value={form.helmet ? '✅ Fourni' : '❌ Non'} />}
            </div>
            {driverBreakdown && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-center">
                <div className="text-xs text-muted-foreground">Vous recevez par place</div>
                <div className="text-lg font-bold text-primary">{driverBreakdown.driverNet} FCFA</div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="pb-20">
      <div className="container max-w-2xl mx-auto py-4">
        <button onClick={() => (step > 0 ? setStep(step - 1) : navigate(-1))} className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          {step > 0 ? 'Étape précédente' : 'Retour'}
        </button>
        <div className="mb-6 flex gap-1">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            {renderStep()}
          </motion.div>
        </AnimatePresence>
        <div className="mt-6">
          {step < 4 ? (
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(step + 1)} disabled={!canNext()} className="w-full rounded-xl bg-gradient-mali py-3 text-sm font-bold text-primary-foreground shadow-mali disabled:opacity-50">
              Suivant ({step + 1}/5)
            </motion.button>
          ) : (
            <motion.button whileTap={{ scale: 0.97 }} onClick={handlePublish} disabled={publishing} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-mali py-3 text-sm font-bold text-primary-foreground shadow-mali disabled:opacity-50">
              <Check className="h-4 w-4" />
              {publishing ? 'Publication...' : 'Publier le trajet'}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};


const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default PublishTrip;
