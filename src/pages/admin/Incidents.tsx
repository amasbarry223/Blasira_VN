import { useState } from 'react';
import { useIncidents, useUpdateIncident, useResolveIncident } from '@/hooks/useIncidents';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate, formatRelativeTime } from '@/utils/formatters';
import { INCIDENT_TYPES, PRIORITY_LEVELS, INCIDENT_STATUS } from '@/utils/constants';
import { AlertTriangle, CheckCircle2, Archive, Clock } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const statusColumns = [
  { id: 'new', label: 'Nouveau', icon: AlertTriangle, color: 'text-blasira-danger' },
  { id: 'in_progress', label: 'En cours', icon: Clock, color: 'text-blasira-warning' },
  { id: 'resolved', label: 'Résolu', icon: CheckCircle2, color: 'text-blasira-success' },
  { id: 'archived', label: 'Archivé', icon: Archive, color: 'text-muted-foreground' },
];

interface Incident {
  id: string;
  reporter_id: string;
  reported_user_id?: string | null;
  trip_id?: string | null;
  type: string;
  description: string;
  priority: string;
  status: string;
  created_at: string;
  reporter?: { name: string; avatar_url?: string } | null;
  reported_user?: { name: string; avatar_url?: string } | null;
  trip?: { id: string; departure_name: string; destination_name: string } | null;
}

const Incidents = () => {
  const { data: incidents, isLoading } = useIncidents();
  const { mutate: updateIncident, isPending: isUpdating } = useUpdateIncident();
  const { mutate: resolveIncident, isPending: isResolving } = useResolveIncident();
  const { profile } = useAdminAuth();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolveNote, setResolveNote] = useState('');

  const incidentsByStatus = incidents?.reduce((acc: Record<string, Incident[]>, incident: Incident) => {
    const status = incident.status || 'new';
    if (!acc[status]) acc[status] = [];
    acc[status].push(incident);
    return acc;
  }, {}) || {};

  const handleResolve = () => {
    if (!selectedIncident || !profile) return;

    resolveIncident(
      {
        id: selectedIncident.id,
        resolvedBy: profile.id,
      },
      {
        onSuccess: () => {
          setIsResolveModalOpen(false);
          setSelectedIncident(null);
          setResolveNote('');
          toast.success('Incident résolu avec succès');
        },
      }
    );
  };

  const handleStatusChange = (incidentId: string, newStatus: string) => {
    updateIncident(
      {
        id: incidentId,
        data: { status: newStatus as 'new' | 'in_progress' | 'resolved' | 'archived' },
      },
      {
        onSuccess: () => {
          toast.success('Statut mis à jour');
        },
      }
    );
  };

  const getPriorityColor = (priority: string) => {
    const priorityConfig = PRIORITY_LEVELS[priority as keyof typeof PRIORITY_LEVELS];
    if (!priorityConfig) return 'bg-gray-100 text-gray-800';
    
    switch (priority) {
      case 'critical':
        return 'bg-blasira-danger/10 text-blasira-danger border-blasira-danger';
      case 'high':
        return 'bg-blasira-warning/10 text-blasira-warning border-blasira-warning';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'low':
        return 'bg-blasira-success/10 text-blasira-success border-blasira-success';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Incidents</h1>
          <p className="text-muted-foreground">Gérez les incidents signalés par les utilisateurs</p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statusColumns.map((column) => {
          const columnIncidents = incidentsByStatus[column.id] || [];
          const Icon = column.icon;

          return (
            <Card key={column.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Icon className={cn('h-5 w-5', column.color)} />
                  <CardTitle className="text-lg">{column.label}</CardTitle>
                  <Badge variant="secondary" className="ml-auto">
                    {columnIncidents.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-3 max-h-[600px]">
                {columnIncidents.length === 0 ? (
                  <EmptyState
                    title="Aucun incident"
                    description={`Aucun incident dans la catégorie "${column.label}"`}
                    className="h-32"
                  />
                ) : (
                  columnIncidents.map((incident: Incident) => {
                    const typeConfig = INCIDENT_TYPES[incident.type as keyof typeof INCIDENT_TYPES];
                    const priorityColor = getPriorityColor(incident.priority);

                    return (
                      <Card
                        key={incident.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => {
                          setSelectedIncident(incident);
                          if (column.id === 'new' || column.id === 'in_progress') {
                            setIsResolveModalOpen(true);
                          }
                        }}
                      >
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{typeConfig?.label || incident.type}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                {incident.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={incident.reporter?.avatar_url}
                                alt={incident.reporter?.name}
                              />
                              <AvatarFallback className="text-xs">
                                {incident.reporter?.name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              {incident.reporter?.name || 'Utilisateur'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <Badge
                              variant="outline"
                              className={cn('text-xs', priorityColor)}
                            >
                              {PRIORITY_LEVELS[incident.priority as keyof typeof PRIORITY_LEVELS]?.label || incident.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(incident.created_at)}
                            </span>
                          </div>

                          {incident.trip && (
                            <div className="text-xs text-muted-foreground pt-2 border-t">
                              Trajet: {incident.trip.departure_name} → {incident.trip.destination_name}
                            </div>
                          )}

                          {column.id !== 'resolved' && column.id !== 'archived' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full mt-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (column.id === 'new') {
                                  handleStatusChange(incident.id, 'in_progress');
                                } else if (column.id === 'in_progress') {
                                  setSelectedIncident(incident);
                                  setIsResolveModalOpen(true);
                                }
                              }}
                            >
                              {column.id === 'new' ? 'Commencer' : 'Résoudre'}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Resolve Modal */}
      <Dialog open={isResolveModalOpen} onOpenChange={setIsResolveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Résoudre l'incident</DialogTitle>
            <DialogDescription>
              Ajoutez une note de résolution pour cet incident
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedIncident && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Type: {INCIDENT_TYPES[selectedIncident.type as keyof typeof INCIDENT_TYPES]?.label}</p>
                <p className="text-sm text-muted-foreground">{selectedIncident.description}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="resolveNote">Note de résolution (optionnel)</Label>
              <Textarea
                id="resolveNote"
                placeholder="Décrivez comment l'incident a été résolu..."
                value={resolveNote}
                onChange={(e) => setResolveNote(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResolveModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleResolve}>Résoudre l'incident</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Incidents;

