import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function SkipLink({ href = '#main-content', className }: { href?: string; className?: string }) {
  return (
    <Link
      to={href}
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50',
        'focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground',
        'focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring',
        className
      )}
    >
      Aller au contenu principal
    </Link>
  );
}

