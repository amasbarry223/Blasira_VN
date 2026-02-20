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

interface User {
  id: string;
  name: string;
  phone: string;
  role: string;
  verification_status: string;
  university?: string;
}

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: (data: Partial<User>) => Promise<void>;
}

const UserModal = ({ open, onOpenChange, user, onSave }: UserModalProps) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<Partial<User>>();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        phone: user.phone,
        role: user.role,
        verification_status: user.verification_status,
        university: user.university || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: Partial<User>) => {
    await onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}</DialogTitle>
          <DialogDescription>
            {user ? 'Modifiez les informations de l\'utilisateur' : 'Créez un nouvel utilisateur'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" {...register('name', { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" {...register('phone', { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select
              value={watch('role') || ''}
              onValueChange={(value) => setValue('role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Étudiant</SelectItem>
                <SelectItem value="driver_moto">Conducteur Moto</SelectItem>
                <SelectItem value="driver_car">Conducteur Voiture</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="verification_status">Statut de vérification</Label>
            <Select
              value={watch('verification_status') || ''}
              onValueChange={(value) => setValue('verification_status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="verified">Vérifié</SelectItem>
                <SelectItem value="rejected">Rejeté</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="university">Université</Label>
            <Input id="university" {...register('university')} />
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

export default UserModal;

