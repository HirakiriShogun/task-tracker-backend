import { FormEvent, useState } from 'react';
import { Button } from 'shared/ui/Button';
import { ErrorMessage } from 'shared/ui/ErrorMessage';
import { Input } from 'shared/ui/Input';
import { Modal } from 'shared/ui/Modal';

type AddMemberModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (userId: string) => Promise<void>;
};

export function AddMemberModal({
  open,
  onClose,
  onSubmit,
}: AddMemberModalProps) {
  const [userId, setUserId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await onSubmit(userId);
      setUserId('');
      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Не удалось добавить участника',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      description="Укажи `userId` существующего пользователя."
      onClose={onClose}
      open={open}
      title="Добавить участника"
    >
      <form className="stack-lg" onSubmit={handleSubmit}>
        {error ? <ErrorMessage message={error} /> : null}
        <Input
          hint="Скопируй `userId` из другого аккаунта в боковой панели."
          label="ID пользователя"
          onChange={(event) => setUserId(event.target.value)}
          placeholder="8a9d2e06-..."
          required
          value={userId}
        />
        <div className="modal-actions">
          <Button onClick={onClose} type="button" variant="ghost">
            Отмена
          </Button>
          <Button disabled={submitting} type="submit">
            {submitting ? 'Добавляем...' : 'Добавить'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
