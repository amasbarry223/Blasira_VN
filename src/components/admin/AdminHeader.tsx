import { useLocation, Link } from 'react-router-dom';
import { Bell, User, ChevronRight, Home } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const getBreadcrumbs = (pathname: string) => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Admin', href: '/admin/dashboard' }];

  const routeLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    users: 'Utilisateurs',
    trips: 'Trajets',
    bookings: 'Réservations',
    statistics: 'Statistiques',
    settings: 'Paramètres',
  };

  paths.forEach((path, index) => {
    if (path !== 'admin' && routeLabels[path]) {
      const href = '/' + paths.slice(0, index + 1).join('/');
      breadcrumbs.push({
        label: routeLabels[path],
        href,
      });
    }
  });

  return breadcrumbs;
};

const AdminHeader = () => {
  const location = useLocation();
  const { profile, signOut } = useAdminAuth();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/admin/login';
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center">
                {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />}
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                )}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={profile?.avatar_url || undefined}
                    alt={profile?.name || 'Admin'}
                  />
                  <AvatarFallback>
                    {profile?.name?.charAt(0).toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">{profile?.name || 'Administrateur'}</div>
                  <div className="text-xs text-muted-foreground">Admin</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{profile?.name || 'Administrateur'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {profile?.phone || 'Non renseigné'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin/settings">
                  <User className="mr-2 h-4 w-4" />
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <User className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

