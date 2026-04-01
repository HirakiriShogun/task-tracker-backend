import type { WorkspaceMember } from '@/entities/workspace/model/types';
import { Field } from '@/shared/ui/Field';
import { Select } from '@/shared/ui/Select';

type AssignUserSelectProps = {
  members: WorkspaceMember[];
  assigneeId: string | null;
  submitting: boolean;
  onAssign: (assigneeId: string) => void;
};

export function AssignUserSelect({
  members,
  assigneeId,
  submitting,
  onAssign,
}: AssignUserSelectProps) {
  return (
    <div className="task-control">
      <Field label="Assignee">
        <Select
          value={assigneeId || ''}
          onChange={(event) => onAssign(event.target.value)}
          options={members.map((member) => ({
            value: member.userId,
            label: member.user?.fullName || member.userId,
          }))}
          placeholder="Select teammate"
          disabled={!members.length || submitting}
        />
      </Field>
    </div>
  );
}
