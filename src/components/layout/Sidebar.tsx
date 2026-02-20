import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Car,
  Calendar,
  AlertTriangle,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useAdminStore } from '@/store/adminStore';
import logo from '@/assets/logo.png';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
    title: 'Incidents',
    icon: AlertTriangle,
    path: '/admin/incidents',
  },
  {
    title: 'Notifications',
    icon: Bell,
    path: '/admin/notifications',
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

const Sidebar = () => {
  const location = useLocation();
  const { signOut } = useAdminAuth();
  const { sidebarOpen, setSidebarOpen } = useAdminStore();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/admin/login';
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <img src={logo} alt="Blasira" className="h-8 w-8 object-contain" />
        <div>
          <h2 className="text-lg font-bold text-white">Blasira</h2>
          <p className="text-xs text-sidebar-foreground/70">Administration</p>
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
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
              aria-label={item.title}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Déconnexion
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-screen w-64 flex-col bg-blasira-sidebar-bg transition-all duration-200">
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-blasira-sidebar-bg border-sidebar-border">
          <NavContent />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;

