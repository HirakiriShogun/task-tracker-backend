import type { WorkspaceMember } from '@/entities/workspace/model/types';
import { Avatar } from '@/shared/ui/Avatar';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { formatDate } from '@/shared/lib/date';

type MemberCardProps = {
  member: WorkspaceMember;
  canRemove?: boolean;
  onRemove?: (member: WorkspaceMember) => void;
};

export function MemberCard({
  member,
  canRemove,
  onRemove,
}: MemberCardProps) {
  const displayName = member.user?.fullName || 'Unknown member';

  return (
    <Card className="member-card">
      <div className="member-card__main">
        <Avatar name={displayName} accent="cyan" />
        <div>
          <h3>{displayName}</h3>
          <p>{member.user?.email || member.userId}</p>
        </div>
      </div>
      <div className="member-card__meta">
        <Badge tone="neutral">Joined {formatDate(member.joinedAt)}</Badge>
        {canRemove && onRemove ? (
          <Button
            size="sm"
            variant="ghost"
            type="button"
            onClick={() => onRemove(member)}
          >
            Remove
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
