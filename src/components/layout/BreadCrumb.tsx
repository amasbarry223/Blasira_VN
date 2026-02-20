import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  users: 'Utilisateurs',
  trips: 'Trajets',
  bookings: 'Réservations',
  incidents: 'Incidents',
  notifications: 'Notifications',
  statistics: 'Statistiques',
  settings: 'Paramètres',
};

export function BreadCrumb() {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  const breadcrumbs = [
    {
      label: 'Admin',
      href: '/admin/dashboard',
      icon: Home,
    },
  ];

  paths.forEach((path, index) => {
    if (path !== 'admin' && routeLabels[path]) {
      const href = '/' + paths.slice(0, index + 1).join('/');
      breadcrumbs.push({
        label: routeLabels[path],
        href,
        icon: undefined,
      });
    }
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const Icon = crumb.icon;

          return (
            <div key={crumb.href} className="flex items-center">
              {index > 0 && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-3.5 w-3.5" />
                </BreadcrumbSeparator>
              )}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="flex items-center gap-1">
                    {Icon && <Icon className="h-4 w-4" />}
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.href} className="flex items-center gap-1">
                      {Icon && <Icon className="h-4 w-4" />}
                      {crumb.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

