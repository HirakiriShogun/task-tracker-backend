type LoadingStateProps = {
  title?: string;
  description?: string;
  compact?: boolean;
};

export function LoadingState({
  title = 'Загрузка',
  description = 'Обновляем данные.',
  compact = false,
}: LoadingStateProps) {
  return (
    <div className={`ui-loading ${compact ? 'ui-loading--compact' : ''}`}>
      <span className="ui-loading__spinner" />
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}
