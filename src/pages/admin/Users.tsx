import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/admin/DataTable';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useUsers, useUpdateUser, useVerifyUser, useSuspendUser, useDeleteUser } from '@/hooks/useUsers';
import { useUserStats } from '@/hooks/useUsers';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatDate, formatPhone } from '@/utils/formatters';
import { ROLES, STATUS_LABELS } from '@/utils/constants';
import { Eye, CheckCircle2, XCircle, Trash2, Mail, Car, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminStore } from '@/store/adminStore';
import { EmptyState } from '@/components/ui/EmptyState';

interface User {
  id: string;
  name: string;
  phone?: string;
  role: string;
  verification_status: string;
  university?: string;
  total_trips?: number;
  rating?: number;
  created_at: string;
  avatar_url?: string;
}

const Users = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { userFilters, setUserFilters, clearUserFilters } = useAdminStore();

  const filters = {
    role: userFilters.role === 'all' ? undefined : userFilters.role,
    verification_status: userFilters.status === 'all' ? undefined : userFilters.status,
    search: userFilters.search,
  };

  const { data: usersData, isLoading } = useUsers(filters);
  const users = usersData || [];
  const { data: userStats } = useUserStats(selectedUser?.id || '');
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: verifyUser, isPending: isVerifying } = useVerifyUser();
  const { mutate: suspendUser, isPending: isSuspending } = useSuspendUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleVerify = (userId: string) => {
    verifyUser(userId);
  };

  const handleSuspend = (userId: string) => {
    suspendUser(userId);
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'avatar_url',
      header: '',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar_url} alt={user.name} />
            <AvatarFallback>
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Nom',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div>
            <div className="font-medium">{user.name || 'Sans nom'}</div>
            {user.university && (
              <div className="text-sm text-muted-foreground">{user.university}</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: 'Téléphone',
      cell: ({ row }) => {
        const phone = row.getValue('phone') as string;
        return phone ? formatPhone(phone) : '-';
      },
    },
    {
      accessorKey: 'role',
      header: 'Rôle',
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        const roleConfig = ROLES[role as keyof typeof ROLES];
        return <StatusBadge status={role === 'student' ? 'student' : role === 'driver_moto' || role === 'driver_car' ? 'driver' : 'active'} />;
      },
    },
    {
      accessorKey: 'verification_status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.getValue('verification_status') as string;
        return <StatusBadge status={status as 'active' | 'suspended' | 'pending' | 'verified' | 'rejected'} />;
      },
    },
    {
      accessorKey: 'total_trips',
      header: 'Trajets',
      cell: ({ row }) => {
        const trips = row.getValue('total_trips') as number;
        return <span>{trips || 0}</span>;
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Inscription',
      cell: ({ row }) => {
        const date = row.getValue('created_at') as string;
        return <span className="text-sm">{formatDate(date)}</span>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleViewUser(user)}
              aria-label="Voir le profil"
            >
              <Eye className="h-4 w-4" />
            </Button>
            {user.verification_status === 'pending' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleVerify(user.id)}
                aria-label="Vérifier"
                loading={isVerifying}
                disabled={isVerifying}
              >
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(user)}
              aria-label="Supprimer"
              loading={isDeleting}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground">Gérez tous les utilisateurs de la plateforme</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Recherche</Label>
              <Input
                placeholder="Nom, téléphone..."
                value={userFilters.search || ''}
                onChange={(e) => setUserFilters({ search: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select
                value={userFilters.status || 'all'}
                onValueChange={(value) => setUserFilters({ status: value === 'all' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="verified">Vérifié</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Rôle</Label>
              <Select
                value={userFilters.role || 'all'}
                onValueChange={(value) => setUserFilters({ role: value === 'all' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les rôles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="student">Étudiant</SelectItem>
                  <SelectItem value="driver_moto">Conducteur Moto</SelectItem>
                  <SelectItem value="driver_car">Conducteur Voiture</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                variant="outline"
                className="w-full"
                onClick={clearUserFilters}
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={users}
        searchColumnId="name"
        searchPlaceholder="Rechercher par nom..."
        isLoading={isLoading}
        enableExport
      />

      {/* User Detail Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selectedUser && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedUser.avatar_url} alt={selectedUser.name} />
                    <AvatarFallback className="text-lg">
                      {selectedUser.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle>{selectedUser.name || 'Sans nom'}</SheetTitle>
                    <SheetDescription>
                      {selectedUser.phone ? formatPhone(selectedUser.phone) : 'Sans téléphone'}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <Tabs defaultValue="overview" className="mt-6">
                <TabsList>
                  <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                  <TabsTrigger value="trips">Trajets</TabsTrigger>
                  <TabsTrigger value="history">Historique</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Statistiques</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Trajets effectués</span>
                          <span className="font-medium">{selectedUser.total_trips || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Note moyenne</span>
                          <span className="font-medium">{selectedUser.rating?.toFixed(1) || '0.0'}/5</span>
                        </div>
                        {userStats && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Réservations</span>
                              <span className="font-medium">{userStats.bookingsCount}</span>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Informations</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Rôle</span>
                          <StatusBadge status={selectedUser.role === 'student' ? 'student' : selectedUser.role === 'driver_moto' || selectedUser.role === 'driver_car' ? 'driver' : 'active'} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Statut vérification</span>
                          <StatusBadge status={selectedUser.verification_status as 'active' | 'suspended' | 'pending' | 'verified' | 'rejected'} />
                        </div>
                        {selectedUser.university && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Université</span>
                            <span className="text-sm">{selectedUser.university}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Inscription</span>
                          <span className="text-sm">{formatDate(selectedUser.created_at)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex gap-2">
                    {selectedUser.verification_status === 'pending' && (
                      <Button onClick={() => handleVerify(selectedUser.id)} loading={isVerifying} disabled={isVerifying}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Vérifier le compte
                      </Button>
                    )}
                    {selectedUser.verification_status === 'verified' && (
                      <Button variant="outline" onClick={() => handleSuspend(selectedUser.id)} loading={isSuspending} disabled={isSuspending}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Suspendre
                      </Button>
                    )}
                    <Button variant="outline">
                      <Mail className="mr-2 h-4 w-4" />
                      Envoyer un message
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="trips" className="mt-4">
                  <EmptyState
                    title="Aucun trajet"
                    description="Cet utilisateur n'a pas encore publié de trajet"
                    icon={Car}
                  />
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                  <EmptyState
                    title="Aucun historique"
                    description="L'historique des actions admin sera affiché ici"
                    icon={Calendar}
                  />
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Supprimer l'utilisateur"
        description={`Êtes-vous sûr de vouloir supprimer ${userToDelete?.name || 'cet utilisateur'} ? Cette action est irréversible.`}
        onConfirm={() => {
          if (userToDelete) {
            deleteUser(userToDelete.id);
            setDeleteDialogOpen(false);
            setUserToDelete(null);
          }
        }}
        variant="destructive"
        confirmLabel="Supprimer"
      />
    </div>
  );
};

export default Users;
