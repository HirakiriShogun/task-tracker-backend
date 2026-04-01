import type { WorkspaceMember } from '@/entities/workspace/model/types';
import type { Task } from '@/entities/task/model/types';
import { taskStatusLabels, taskStatusOrder } from '@/entities/task/model/task-meta';
import { TaskCard } from '@/entities/task/ui/TaskCard';
import { EmptyState } from '@/shared/ui/EmptyState';

type TaskBoardProps = {
  tasks: Task[];
  members: WorkspaceMember[];
  onOpenTask: (taskId: string) => void;
};

export function TaskBoard({ tasks, members, onOpenTask }: TaskBoardProps) {
  if (!tasks.length) {
    return (
      <EmptyState
        title="No tasks in motion"
        description="Create the first task and start moving work through the flow."
      />
    );
  }

  return (
    <div className="task-board">
      {taskStatusOrder.map((status) => {
        const columnTasks = tasks.filter((task) => task.status === status);

        return (
          <section key={status} className="task-board__column">
            <div className="task-board__column-header">
              <h3>{taskStatusLabels[status]}</h3>
              <span>{columnTasks.length}</span>
            </div>
            <div className="task-board__column-body">
              {columnTasks.length ? (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    authorName={
                      members.find((member) => member.userId === task.authorId)?.user
                        ?.fullName
                    }
                    assigneeName={
                      members.find((member) => member.userId === task.assigneeId)?.user
                        ?.fullName
                    }
                    onOpen={onOpenTask}
                  />
                ))
              ) : (
                <div className="task-board__empty">No tasks here yet.</div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
