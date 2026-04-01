import { useEffect, useState } from 'react';
import type { Workspace } from '@/entities/workspace/model/types';
import type { User } from '@/entities/user/model/types';
import { workspacesApi } from '@/shared/api/endpoints/workspaces';
import { getErrorMessage } from '@/shared/lib/errors';
import { Button } from '@/shared/ui/Button';
import { Field } from '@/shared/ui/Field';
import { Input } from '@/shared/ui/Input';
import { Modal } from '@/shared/ui/Modal';
import { Select } from '@/shared/ui/Select';
import { Textarea } from '@/shared/ui/Textarea';

type CreateWorkspaceModalProps = {
  open: boolean;
  users: User[];
  onClose: () => void;
  onCreated: (workspace: Workspace) => void;
};

export function CreateWorkspaceModal({
  open,
  users,
  onClose,
  onCreated,
}: CreateWorkspaceModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName('');
      setDescription('');
      setCreatorId(users[0]?.id || '');
      setError('');
    }
  }, [open, users]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitting(true);
    setError('');

    try {
      const workspace = await workspacesApi.create({
        name,
        description,
        creatorId,
      });

      onCreated(workspace);
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
      title="Create workspace"
      description="Spin up a new command center for projects, people and task flow."
      onClose={onClose}
    >
      <form className="form-stack" onSubmit={handleSubmit}>
        <Field label="Workspace name">
          <Input
            placeholder="Team Alpha"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </Field>
        <Field label="Description">
          <Textarea
            placeholder="High-context workspace for product and engineering planning."
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </Field>
        <Field
          label="Creator"
          hint={
            users.length
              ? 'The creator is added as the first member automatically.'
              : 'No users found in the backend yet.'
          }
        >
          <Select
            value={creatorId}
            onChange={(event) => setCreatorId(event.target.value)}
            options={users.map((user) => ({
              value: user.id,
              label: `${user.fullName} · ${user.email}`,
            }))}
            disabled={!users.length}
            required
          />
        </Field>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="form-actions">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting || !users.length}>
            {submitting ? 'Creating…' : 'Create workspace'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
