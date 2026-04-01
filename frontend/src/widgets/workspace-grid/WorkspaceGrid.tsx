import type { Project } from '@/entities/project/model/types';
import type { Workspace } from '@/entities/workspace/model/types';
import { WorkspaceCard } from '@/entities/workspace/ui/WorkspaceCard';

type WorkspaceGridProps = {
  workspaces: Workspace[];
  projects: Project[];
};

export function WorkspaceGrid({ workspaces, projects }: WorkspaceGridProps) {
  return (
    <div className="workspace-grid">
      {workspaces.map((workspace) => (
        <WorkspaceCard
          key={workspace.id}
          workspace={workspace}
          projectCount={
            projects.filter((project) => project.workspaceId === workspace.id).length
          }
        />
      ))}
    </div>
  );
}
