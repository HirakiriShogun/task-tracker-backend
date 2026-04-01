import { useEffect, useState } from 'react';
import type { Project } from '@/entities/project/model/types';
import type { WorkspaceMember } from '@/entities/workspace/model/types';
import { projectsApi } from '@/shared/api/endpoints/projects';
import { getErrorMessage } from '@/shared/lib/errors';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Field } from '@/shared/ui/Field';
import { Input } from '@/shared/ui/Input';
import { Modal } from '@/shared/ui/Modal';
import { Select } from '@/shared/ui/Select';
import { Textarea } from '@/shared/ui/Textarea';

type CreateProjectModalProps = {
  open: boolean;
  workspaceId: string;
  members: WorkspaceMember[];
  onClose: () => void;
  onCreated: (project: Project) => void;
};

export function CreateProjectModal({
  open,
  workspaceId,
  members,
  onClose,
  onCreated,
}: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName('');
      setDescription('');
      setCreatorId(members[0]?.userId || '');
      setError('');
    }
  }, [open, members]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const project = await projectsApi.create({
        name,
        description,
        workspaceId,
        creatorId,
      });
      onCreated(project);
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
      title="Create project"
      description="Launch a focused delivery track inside this workspace."
      onClose={onClose}
    >
      {!members.length ? (
        <EmptyState
          title="No workspace members"
          description="Add at least one teammate before creating a project."
        />
      ) : (
        <form className="form-stack" onSubmit={handleSubmit}>
          <Field label="Project name">
            <Input
              placeholder="Task Tracker API"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </Field>
          <Field label="Description">
            <Textarea
              placeholder="Execution stream for backend and UI delivery."
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </Field>
          <Field label="Creator">
            <Select
              value={creatorId}
              onChange={(event) => setCreatorId(event.target.value)}
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
              {submitting ? 'Creating…' : 'Create project'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
