import type { WorkspaceMember } from '@/entities/workspace/model/types';
import { MemberCard } from '@/entities/user/ui/MemberCard';
import { EmptyState } from '@/shared/ui/EmptyState';

type WorkspaceMembersPanelProps = {
  members: WorkspaceMember[];
  onRemove: (member: WorkspaceMember) => void;
};

export function WorkspaceMembersPanel({
  members,
  onRemove,
}: WorkspaceMembersPanelProps) {
  if (!members.length) {
    return (
      <EmptyState
        title="No members inside"
        description="Invite teammates so projects and tasks can be assigned to real people."
      />
    );
  }

  return (
    <div className="stack-list">
      {members.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          canRemove
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
