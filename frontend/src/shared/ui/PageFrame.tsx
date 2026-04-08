import type { PropsWithChildren, ReactNode } from 'react';

type PageFrameProps = PropsWithChildren<{
  header: ReactNode;
}>;

export function PageFrame({
  header,
  children,
}: PageFrameProps) {
  return (
    <div className="page-frame">
      <div className="page-frame__hero">{header}</div>
      <div className="page-frame__content">{children}</div>
    </div>
  );
}
