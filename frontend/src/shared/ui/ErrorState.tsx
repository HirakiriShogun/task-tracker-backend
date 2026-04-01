import type { ReactNode } from 'react';

type ErrorStateProps = {
  title?: string;
  message: string;
  action?: ReactNode;
};

export function ErrorState({
  title = 'Something went off track',
  message,
  action,
}: ErrorStateProps) {
  return (
    <div className="ui-feedback-card ui-feedback-card--error">
      <div className="ui-feedback-card__badge">!</div>
      <div>
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
      {action ? <div className="ui-feedback-card__action">{action}</div> : null}
    </div>
  );
}
