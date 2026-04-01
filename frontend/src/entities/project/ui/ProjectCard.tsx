import { Link } from 'react-router-dom';
import type { Project } from '@/entities/project/model/types';
import { Card } from '@/shared/ui/Card';

type ProjectCardProps = {
  project: Project;
  taskCount?: number;
};

export function ProjectCard({ project, taskCount }: ProjectCardProps) {
  return (
    <Link className="project-card-link" to={`/projects/${project.id}`}>
      <Card className="project-card">
        <div className="project-card__accent" />
        <div className="project-card__content">
          <div>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
          </div>
          <span className="project-card__count">
            {taskCount ?? 0} {taskCount === 1 ? 'task' : 'tasks'}
          </span>
        </div>
      </Card>
    </Link>
  );
}
