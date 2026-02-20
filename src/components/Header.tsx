import { Bell, LogIn, Search, PlusCircle, ClipboardList, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/logo.png';

const desktopNav = [
  { label: 'Chercher', path: '/search', icon: Search },
  { label: 'Publier', path: '/publish', icon: PlusCircle },
  { label: 'Mes trajets', path: '/my-trips', icon: ClipboardList },
  { label: 'Profil', path: '/profile', icon: User },
];

const Header = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <img src={logo} alt="Blasira" className="h-10 w-10 object-contain md:h-11 md:w-11" />
          <span className="text-xl font-bold text-gradient-mali md:text-2xl">Blasira</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          {desktopNav.map(({ label, path, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <button 
              className="relative rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-mali-red" aria-hidden="true" />
            </button>
          ) : (
            <Link 
              to="/auth" 
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Connexion</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
