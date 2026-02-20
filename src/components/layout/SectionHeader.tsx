import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  description?: string | ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  badge?: string | ReactNode;
}

const SectionHeader = ({ 
  title, 
  subtitle, 
  description, 
  className,
  align = 'center',
  badge
}: SectionHeaderProps) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={cn('mb-8 md:mb-12', alignClasses[align], className)}>
      {badge && (
        <div className="mb-3 inline-flex items-center justify-center">
          {typeof badge === 'string' ? (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {badge}
            </span>
          ) : (
            badge
          )}
        </div>
      )}
      {subtitle && (
        <p className="mb-2 text-sm font-medium text-primary md:text-base">
          {subtitle}
        </p>
      )}
      <h2 className="mb-4 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;

