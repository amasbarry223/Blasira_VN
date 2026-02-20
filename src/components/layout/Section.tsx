import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  container?: boolean;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const Section = ({ 
  children, 
  className, 
  id,
  container = true,
  spacing = 'md'
}: SectionProps) => {
  const spacingClasses = {
    none: '',
    sm: 'py-6 md:py-8',
    md: 'py-10 md:py-16',
    lg: 'py-16 md:py-24',
    xl: 'py-20 md:py-32',
  };

  return (
    <section 
      id={id}
      className={cn(
        spacingClasses[spacing],
        className
      )}
    >
      {container ? (
        <div className="container">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
};

export default Section;

