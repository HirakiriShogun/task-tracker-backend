import type { Project } from '@/entities/project/model/types';
import { ProjectCard } from '@/entities/project/ui/ProjectCard';
import { EmptyState } from '@/shared/ui/EmptyState';

type WorkspaceProjectsPanelProps = {
  projects: Project[];
  taskCounts: Record<string, number>;
};

export function WorkspaceProjectsPanel({
  projects,
  taskCounts,
}: WorkspaceProjectsPanelProps) {
  if (!projects.length) {
    return (
      <EmptyState
        title="No projects yet"
        description="Create the first project to turn this workspace into a delivery stream."
      />
    );
  }

  return (
    <div className="stack-list">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          taskCount={taskCounts[project.id] || 0}
        />
      ))}
    </div>
  );
}
