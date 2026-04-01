import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export type BadgeTone = 'accent' | 'neutral' | 'success' | 'warning' | 'danger';

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
};

export function Badge({
  children,
  tone = 'neutral',
  className,
}: BadgeProps) {
  return (
    <span className={cn('ui-badge', `ui-badge--${tone}`, className)}>
      {children}
    </span>
  );
}
