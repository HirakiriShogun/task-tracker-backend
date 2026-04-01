import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('ui-card', className)} {...props}>
      {children}
    </div>
  );
}
