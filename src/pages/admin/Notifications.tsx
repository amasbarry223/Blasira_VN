import { useState } from 'react';
import { useNotifications, useCreateNotification } from '@/hooks/useNotifications';
import { useUsers } from '@/hooks/useUsers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate, formatDateTime } from '@/utils/formatters';
import { NOTIFICATION_TYPES, NOTIFICATION_TARGET_TYPES } from '@/utils/constants';
import { Bell, Mail, MessageSquare, Send, Calendar } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { ColumnDef } from '@tanstack/react-table';
import type { Profile } from '@/services/usersService';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notificationSchema, type NotificationFormData } from '@/schemas/notificationSchema';

interface User extends Profile {
  id: string;
  name: string;
  phone?: string;
}

interface Notification {
  id: string;
  title: string;
  target_type: string;
  type: string;
  status: string;
  created_at: string;
}

const Notifications = () => {
  const { profile } = useAdminAuth();
  const { data: notifications, isLoading } = useNotifications();
  const { data: usersData } = useUsers();
  const users = usersData?.data || usersData || [];
  const { mutate: createNotification, isPending } = useCreateNotification();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      target_type: 'all',
      target_ids: [],
      type: 'push',
      title: '',
      body: '',
      scheduled_at: null,
      sendNow: true,
    },
  });

  const targetType = watch('target_type');
  const sendNow = watch('sendNow');

  const onSubmit = (data: NotificationFormData) => {
    createNotification(
      {
        target_type: data.target_type,
        target_ids: data.target_type === 'specific' ? data.target_ids : undefined,
        type: data.type,
        title: data.title,
        body: data.body,
        scheduled_at: sendNow ? null : data.scheduled_at || null,
      },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  const columns: ColumnDef<Notification>[] = [
    {
      accessorKey: 'title',
      header: 'Titre',
    },
    {
      accessorKey: 'target_type',
      header: 'Cible',
      cell: ({ row }) => {
        const targetType = row.getValue('target_type') as string;
        return NOTIFICATION_TARGET_TYPES[targetType as keyof typeof NOTIFICATION_TARGET_TYPES]?.label || targetType;
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        const typeConfig = NOTIFICATION_TYPES[type as keyof typeof NOTIFICATION_TYPES];
        const Icon = type === 'push' ? Bell : type === 'email' ? Mail : MessageSquare;
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span>{typeConfig?.label || type}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return <StatusBadge status={status as 'active' | 'suspended' | 'pending' | 'verified'} />;
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: ({ row }) => {
        const date = row.getValue('created_at') as string;
        return <span className="text-sm">{formatDateTime(date)}</span>;
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">Envoyez des notifications aux utilisateurs</p>
      </div>

      <Tabs defaultValue="compose" className="space-y-4">
        <TabsList>
          <TabsTrigger value="compose">Composer</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle notification</CardTitle>
              <CardDescription>Créez et envoyez une notification aux utilisateurs</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="target_type">Cible</Label>
                    <Select
                      value={targetType}
                      onValueChange={(value: 'all' | 'drivers' | 'passengers' | 'specific') => {
                        setValue('target_type', value);
                        if (value !== 'specific') {
                          setValue('target_ids', []);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(NOTIFICATION_TARGET_TYPES).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={watch('type')}
                      onValueChange={(value: 'push' | 'email' | 'sms') => setValue('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(NOTIFICATION_TYPES).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {targetType === 'specific' && (
                  <div className="space-y-2">
                    <Label>Utilisateurs spécifiques</Label>
                    <Select
                      onValueChange={(value) => {
                        const currentIds = watch('target_ids') || [];
                        if (!currentIds.includes(value)) {
                          setValue('target_ids', [...currentIds, value]);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un utilisateur" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user: User) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.phone})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.target_ids && (
                      <p className="text-sm text-destructive">{errors.target_ids.message}</p>
                    )}
                    {(watch('target_ids') || []).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(watch('target_ids') || []).map((id) => {
                          const user = users.find((u: User) => u.id === id);
                          return (
                            <div
                              key={id}
                              className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm"
                            >
                              <span>{user?.name || id}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const currentIds = watch('target_ids') || [];
                                  setValue('target_ids', currentIds.filter((i) => i !== id));
                                }}
                                className="ml-1 hover:text-destructive"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Titre de la notification"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body">Corps du message</Label>
                  <Textarea
                    id="body"
                    {...register('body')}
                    placeholder="Contenu de la notification"
                    rows={6}
                  />
                  {errors.body && (
                    <p className="text-sm text-destructive">{errors.body.message}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="sendNow"
                    checked={sendNow}
                    onCheckedChange={(checked) => setValue('sendNow', checked)}
                  />
                  <Label htmlFor="sendNow">Envoyer maintenant</Label>
                </div>

                {!sendNow && (
                  <div className="space-y-2">
                    <Label htmlFor="scheduled_at">Date et heure programmée</Label>
                    <Input
                      id="scheduled_at"
                      type="datetime-local"
                      {...register('scheduled_at')}
                    />
                    {errors.scheduled_at && (
                      <p className="text-sm text-destructive">{errors.scheduled_at.message}</p>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => reset()}>
                    Réinitialiser
                  </Button>
                  <Button type="submit" disabled={isPending} loading={isPending}>
                    <Send className="mr-2 h-4 w-4" />
                    {sendNow ? 'Envoyer maintenant' : 'Programmer'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des notifications</CardTitle>
              <CardDescription>Liste de toutes les notifications envoyées</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={notifications || []}
                searchColumnId="title"
                searchPlaceholder="Rechercher par titre..."
                enableExport
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;

