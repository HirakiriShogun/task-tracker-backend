import { Link } from 'react-router-dom';
import type { Workspace } from '@/entities/workspace/model/types';
import { Card } from '@/shared/ui/Card';

type WorkspaceCardProps = {
  workspace: Workspace;
  projectCount: number;
};

export function WorkspaceCard({
  workspace,
  projectCount,
}: WorkspaceCardProps) {
  return (
    <Link className="workspace-card-link" to={`/workspaces/${workspace.id}`}>
      <Card className="workspace-card">
        <div className="workspace-card__header">
          <span className="workspace-card__spark" />
          <span className="workspace-card__meta">
            {projectCount} {projectCount === 1 ? 'project' : 'projects'}
          </span>
        </div>
        <div className="workspace-card__body">
          <h3>{workspace.name}</h3>
          <p>{workspace.description}</p>
        </div>
      </Card>
    </Link>
  );
}
