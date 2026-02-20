import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <Alert
      variant="destructive"
      className={cn(
        'fixed top-16 left-1/2 z-50 w-full max-w-md -translate-x-1/2 transform shadow-lg',
        'animate-in slide-in-from-top-2'
      )}
    >
      <WifiOff className="h-4 w-4" />
      <AlertDescription>
        Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.
      </AlertDescription>
    </Alert>
  );
}

