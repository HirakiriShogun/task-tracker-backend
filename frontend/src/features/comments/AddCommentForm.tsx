import { FormEvent, useState } from 'react';
import { Button } from 'shared/ui/Button';
import { Textarea } from 'shared/ui/Textarea';

type AddCommentFormProps = {
  onSubmit: (content: string) => Promise<void>;
};

export function AddCommentForm({
  onSubmit,
}: AddCommentFormProps) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit(content);
      setContent('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="stack-md" onSubmit={handleSubmit}>
      <Textarea
        label="Комментарий"
        onChange={(event) => setContent(event.target.value)}
        placeholder="Кратко зафиксируй прогресс, блокер или решение."
        required
        rows={4}
        value={content}
      />
      <div className="modal-actions">
        <Button disabled={submitting} type="submit">
          {submitting ? 'Публикуем...' : 'Отправить'}
        </Button>
      </div>
    </form>
  );
}
