import { useEffect, useState } from 'react';
import type { User } from '@/entities/user/model/types';
import type { WorkspaceMember } from '@/entities/workspace/model/types';
import { workspacesApi } from '@/shared/api/endpoints/workspaces';
import { getErrorMessage } from '@/shared/lib/errors';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Field } from '@/shared/ui/Field';
import { Modal } from '@/shared/ui/Modal';
import { Select } from '@/shared/ui/Select';

type AddMemberModalProps = {
  open: boolean;
  workspaceId: string;
  users: User[];
  onClose: () => void;
  onAdded: (member: WorkspaceMember) => void;
};

export function AddMemberModal({
  open,
  workspaceId,
  users,
  onClose,
  onAdded,
}: AddMemberModalProps) {
  const [userId, setUserId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setUserId(users[0]?.id || '');
      setError('');
    }
  }, [open, users]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const member = await workspacesApi.addMember(workspaceId, { userId });
      onAdded(member);
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
      title="Add teammate"
      description="Invite an existing user into this workspace to collaborate on projects and tasks."
      onClose={onClose}
    >
      {!users.length ? (
        <EmptyState
          title="Everyone is already inside"
          description="There are no remaining users available to add to this workspace."
        />
      ) : (
        <form className="form-stack" onSubmit={handleSubmit}>
          <Field label="User">
            <Select
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              options={users.map((user) => ({
                value: user.id,
                label: `${user.fullName} · ${user.email}`,
              }))}
            />
          </Field>
          {error ? <p className="form-error">{error}</p> : null}
          <div className="form-actions">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add member'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
