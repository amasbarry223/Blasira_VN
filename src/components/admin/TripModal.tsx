import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Trip {
  id: string;
  departure_name: string;
  destination_name: string;
  type: string;
  status: string;
  seats_available: number;
  price_per_seat: number;
}

interface TripModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: Trip | null;
  onSave: (data: Partial<Trip>) => Promise<void>;
}

const TripModal = ({ open, onOpenChange, trip, onSave }: TripModalProps) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<Partial<Trip>>();

  useEffect(() => {
    if (trip) {
      reset({
        departure_name: trip.departure_name,
        destination_name: trip.destination_name,
        type: trip.type,
        status: trip.status,
        seats_available: trip.seats_available,
        price_per_seat: trip.price_per_seat,
      });
    }
  }, [trip, reset]);

  const onSubmit = async (data: Partial<Trip>) => {
    await onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{trip ? 'Modifier le trajet' : 'Nouveau trajet'}</DialogTitle>
          <DialogDescription>
            {trip ? 'Modifiez les informations du trajet' : 'Créez un nouveau trajet'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="departure_name">Lieu de départ</Label>
            <Input id="departure_name" {...register('departure_name', { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="destination_name">Destination</Label>
            <Input id="destination_name" {...register('destination_name', { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type de véhicule</Label>
            <Select
              value={watch('type') || ''}
              onValueChange={(value) => setValue('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="voiture">Voiture</SelectItem>
                <SelectItem value="moto">Moto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={watch('status') || ''}
              onValueChange={(value) => setValue('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Publié</SelectItem>
                <SelectItem value="full">Complet</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seats_available">Places disponibles</Label>
              <Input
                id="seats_available"
                type="number"
                {...register('seats_available', { required: true, valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_per_seat">Prix par place (FCFA)</Label>
              <Input
                id="price_per_seat"
                type="number"
                {...register('price_per_seat', { required: true, valueAsNumber: true })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TripModal;

