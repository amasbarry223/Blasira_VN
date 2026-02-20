import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Car,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import logo from '@/assets/logo.png';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/admin/dashboard',
  },
  {
    title: 'Utilisateurs',
    icon: Users,
    path: '/admin/users',
  },
  {
    title: 'Trajets',
    icon: Car,
    path: '/admin/trips',
  },
  {
    title: 'Réservations',
    icon: Calendar,
    path: '/admin/bookings',
  },
  {
    title: 'Statistiques',
    icon: BarChart3,
    path: '/admin/statistics',
  },
  {
    title: 'Paramètres',
    icon: Settings,
    path: '/admin/settings',
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useAdminAuth();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/admin/login';
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <img src={logo} alt="Blasira" className="h-8 w-8 object-contain" />
        <div>
          <h2 className="text-lg font-bold text-gradient-mali">Blasira</h2>
          <p className="text-xs text-muted-foreground">Administration</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;

