import { Button } from './Button';

type ErrorMessageProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorMessage({
  title = 'Ошибка',
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="ui-error">
      <div>
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry} type="button">
          Повторить
        </Button>
      ) : null}
    </div>
  );
}
