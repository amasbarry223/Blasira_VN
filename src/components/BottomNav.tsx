import { Home, Search, PlusCircle, ClipboardList, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'Accueil', path: '/' },
  { icon: Search, label: 'Chercher', path: '/search' },
  { icon: PlusCircle, label: 'Publier', path: '/publish' },
  { icon: ClipboardList, label: 'Trajets', path: '/my-trips' },
  { icon: User, label: 'Profil', path: '/profile' },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/80 md:hidden safe-area-bottom"
      aria-label="Navigation mobile"
    >
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              aria-current={isActive ? 'page' : undefined}
              aria-label={label}
              className={`flex flex-col items-center gap-1 px-3 py-2 text-xs transition-all rounded-lg ${
                isActive
                  ? 'text-primary font-semibold bg-primary/10'
                  : 'text-muted-foreground active:bg-muted'
              }`}
            >
              <Icon 
                className={`h-5 w-5 ${path === '/publish' ? 'h-6 w-6' : ''}`} 
                aria-hidden="true"
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
