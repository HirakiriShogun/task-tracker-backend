import type { PropsWithChildren } from 'react';

type BadgeProps = PropsWithChildren<{
  tone?: 'neutral' | 'blue' | 'green' | 'amber' | 'rose';
}>;

export function Badge({
  children,
  tone = 'neutral',
}: BadgeProps) {
  return <span className={`ui-badge ui-badge--${tone}`}>{children}</span>;
}
