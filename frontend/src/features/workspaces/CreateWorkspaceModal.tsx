import { FormEvent, useState } from 'react';
import { Button } from 'shared/ui/Button';
import { ErrorMessage } from 'shared/ui/ErrorMessage';
import { Input } from 'shared/ui/Input';
import { Modal } from 'shared/ui/Modal';
import { Textarea } from 'shared/ui/Textarea';

type CreateWorkspaceModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { name: string; description: string }) => Promise<void>;
};

export function CreateWorkspaceModal({
  open,
  onClose,
  onSubmit,
}: CreateWorkspaceModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await onSubmit({ name, description });
      setName('');
      setDescription('');
      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Не удалось создать пространство',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      description="Новое пространство для проектов, задач и участников."
      onClose={onClose}
      open={open}
      title="Создать пространство"
    >
      <form className="stack-lg" onSubmit={handleSubmit}>
        {error ? <ErrorMessage message={error} /> : null}
        <Input
          label="Название"
          onChange={(event) => setName(event.target.value)}
          placeholder="Платформа"
          required
          value={name}
        />
        <Textarea
          label="Описание"
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Коротко опиши назначение пространства."
          required
          rows={4}
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
