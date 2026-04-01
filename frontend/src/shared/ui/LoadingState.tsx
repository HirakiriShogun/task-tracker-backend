type LoadingStateProps = {
  title?: string;
  description?: string;
};

export function LoadingState({
  title = 'Loading workspace',
  description = 'Preparing the latest project data and team context.',
}: LoadingStateProps) {
  return (
    <div className="ui-feedback-card">
      <div className="ui-spinner" />
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}
