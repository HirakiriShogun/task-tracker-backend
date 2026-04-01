import { useEffect, useState } from 'react';
import type { Task } from '@/entities/task/model/types';
import type { WorkspaceMember } from '@/entities/workspace/model/types';
import { tasksApi } from '@/shared/api/endpoints/tasks';
import { getErrorMessage } from '@/shared/lib/errors';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Field } from '@/shared/ui/Field';
import { Input } from '@/shared/ui/Input';
import { Modal } from '@/shared/ui/Modal';
import { Select } from '@/shared/ui/Select';
import { Textarea } from '@/shared/ui/Textarea';

type CreateTaskModalProps = {
  open: boolean;
  projectId: string;
  members: WorkspaceMember[];
  onClose: () => void;
  onCreated: (task: Task) => void;
};

export function CreateTaskModal({
  open,
  projectId,
  members,
  onClose,
  onCreated,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setTitle('');
      setDescription('');
      setAuthorId(members[0]?.userId || '');
      setError('');
    }
  }, [open, members]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const task = await tasksApi.create({
        title,
        description,
        projectId,
        authorId,
      });
      onCreated(task);
      onClose();
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Create task"
      description="Capture a deliverable with ownership and a crisp execution brief."
      onClose={onClose}
    >
      {!members.length ? (
        <EmptyState
          title="No collaborators available"
          description="A task needs a workspace member as its author."
        />
      ) : (
        <form className="form-stack" onSubmit={handleSubmit}>
          <Field label="Task title">
            <Input
              placeholder="Ship polished project page"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </Field>
          <Field label="Description" hint="New tasks start as To do with Medium priority.">
            <Textarea
              placeholder="Build a dense, readable task surface with delightful interactions."
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </Field>
          <Field label="Author">
            <Select
              value={authorId}
              onChange={(event) => setAuthorId(event.target.value)}
              options={members.map((member) => ({
                value: member.userId,
                label: member.user?.fullName || member.userId,
              }))}
            />
          </Field>
          {error ? <p className="form-error">{error}</p> : null}
          <div className="form-actions">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create task'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
