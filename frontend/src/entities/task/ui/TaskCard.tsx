import type { Task } from '@/entities/task/model/types';
import {
  taskPriorityLabels,
  taskPriorityTone,
  taskStatusLabels,
  taskStatusTone,
} from '@/entities/task/model/task-meta';
import { Badge } from '@/shared/ui/Badge';
import { Card } from '@/shared/ui/Card';

type TaskCardProps = {
  task: Task;
  assigneeName?: string;
  authorName?: string;
  onOpen: (taskId: string) => void;
};

export function TaskCard({
  task,
  assigneeName,
  authorName,
  onOpen,
}: TaskCardProps) {
  return (
    <button className="task-card-button" type="button" onClick={() => onOpen(task.id)}>
      <Card className="task-card">
        <div className="task-card__header">
          <Badge tone={taskStatusTone[task.status]}>
            {taskStatusLabels[task.status]}
          </Badge>
          <Badge tone={taskPriorityTone[task.priority]}>
            {taskPriorityLabels[task.priority]}
          </Badge>
        </div>
        <div className="task-card__body">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </div>
        <div className="task-card__footer">
          <span>Author: {authorName || 'Unknown'}</span>
          <span>{assigneeName ? `Assigned to ${assigneeName}` : 'Unassigned'}</span>
        </div>
      </Card>
    </button>
  );
}
