import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="ui-empty-state">
      <div className="ui-empty-state__glyph" />
      <h3>{title}</h3>
      <p>{description}</p>
      {action ? <div className="ui-empty-state__action">{action}</div> : null}
    </div>
  );
}
