import { FormEvent, useState } from 'react';
import { Button } from 'shared/ui/Button';
import { ErrorMessage } from 'shared/ui/ErrorMessage';
import { Input } from 'shared/ui/Input';
import { Modal } from 'shared/ui/Modal';
import { Textarea } from 'shared/ui/Textarea';

type CreateTaskModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { title: string; description: string }) => Promise<void>;
};

export function CreateTaskModal({
  open,
  onClose,
  onSubmit,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await onSubmit({ title, description });
      setTitle('');
      setDescription('');
      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Не удалось создать задачу',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      description="Задача появится в текущем проекте."
      onClose={onClose}
      open={open}
      title="Создать задачу"
    >
      <form className="stack-lg" onSubmit={handleSubmit}>
        {error ? <ErrorMessage message={error} /> : null}
        <Input
          label="Название"
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Сделать карточку задачи"
          required
          value={title}
        />
        <Textarea
          label="Описание"
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Что нужно сделать и какой ожидается результат."
          required
          rows={5}
          value={description}
        />
        <div className="modal-actions">
          <Button onClick={onClose} type="button" variant="ghost">
            Отмена
          </Button>
          <Button disabled={submitting} type="submit">
            {submitting ? 'Создаём...' : 'Создать'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
