import { z } from 'zod';

export const userUpdateSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100).optional(),
  phone: z.string().regex(/^\+223\d{8}$/, 'Format de téléphone invalide (ex: +223XXXXXXXX)').optional(),
  email: z.string().email('Email invalide').optional(),
  role: z.enum(['student', 'driver_moto', 'driver_car', 'admin']).optional(),
  verification_status: z.enum(['pending', 'verified', 'rejected']).optional(),
  university: z.string().max(200).optional(),
});

export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;

