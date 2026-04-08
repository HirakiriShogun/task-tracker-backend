import type { HTMLAttributes, PropsWithChildren } from 'react';

type CardProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    interactive?: boolean;
  }
>;

export function Card({
  children,
  className = '',
  interactive = false,
  ...props
}: CardProps) {
  return (
    <div
      className={`ui-card ${interactive ? 'ui-card--interactive' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
