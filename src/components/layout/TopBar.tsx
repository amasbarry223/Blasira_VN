import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Bell, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useAdminStore } from '@/store/adminStore';
import { BreadCrumb } from './BreadCrumb';
import { useDebounce } from '@/hooks/useDebounce';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { useNavigate } from 'react-router-dom';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Users, Car, AlertTriangle } from 'lucide-react';

const TopBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAdminAuth();
  const { notificationsCount, sidebarOpen, setSidebarOpen } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { data: searchResults = [], isLoading: isSearching } = useGlobalSearch(debouncedSearchQuery);

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/admin/login';
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Breadcrumbs */}
      <div className="hidden md:flex flex-1">
        <BreadCrumb />
      </div>

      {/* Search */}
      <div className="flex-1 md:max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Rechercher utilisateurs, trajets, incidents..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="pl-9 w-full cursor-pointer"
            aria-label="Recherche globale"
          />
        </div>
        <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <CommandInput
            placeholder="Rechercher utilisateurs, trajets, incidents..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {isSearching ? 'Recherche en cours...' : debouncedSearchQuery.length < 2 ? 'Tapez au moins 2 caractères' : 'Aucun résultat trouvé'}
            </CommandEmpty>
            {searchResults.length > 0 && (
              <CommandGroup heading="Résultats">
                {searchResults.map((result) => {
                  const Icon = result.type === 'user' ? Users : result.type === 'trip' ? Car : AlertTriangle;
                  return (
                    <CommandItem
                      key={`${result.type}-${result.id}`}
                      value={result.title}
                      onSelect={() => {
                        navigate(result.url);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span>{result.title}</span>
                        {result.subtitle && (
                          <span className="text-xs text-muted-foreground">{result.subtitle}</span>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </CommandDialog>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {notificationsCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {notificationsCount > 9 ? '9+' : notificationsCount}
            </Badge>
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={profile?.avatar_url || undefined}
                  alt={profile?.name || 'Admin'}
                />
                <AvatarFallback>
                  {profile?.name?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {profile?.name || 'Administrateur'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {profile?.phone || 'Non renseigné'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin/settings">Paramètres</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;

