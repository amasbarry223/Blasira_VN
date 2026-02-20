import { z } from 'zod';

export const notificationSchema = z.object({
  target_type: z.enum(['all', 'drivers', 'passengers', 'specific']),
  target_ids: z.array(z.string().uuid()).optional(),
  type: z.enum(['push', 'email', 'sms']),
  title: z.string().min(1, 'Le titre est requis').max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  body: z.string().min(1, 'Le message est requis').max(500, 'Le message ne peut pas dépasser 500 caractères'),
  scheduled_at: z.string().datetime().optional().nullable(),
  sendNow: z.boolean().optional(),
}).refine(
  (data) => {
    // If target_type is 'specific', target_ids must be provided and not empty
    if (data.target_type === 'specific') {
      return data.target_ids && data.target_ids.length > 0;
    }
    return true;
  },
  {
    message: 'Vous devez sélectionner au moins un utilisateur pour les notifications spécifiques',
    path: ['target_ids'],
  }
);

export type NotificationFormData = z.infer<typeof notificationSchema>;

