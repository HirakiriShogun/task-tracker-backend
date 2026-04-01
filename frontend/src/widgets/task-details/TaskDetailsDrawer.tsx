import type { Comment } from '@/entities/comment/model/types';
import { CommentCard } from '@/entities/comment/ui/CommentCard';
import type { Task, TaskStatus } from '@/entities/task/model/types';
import {
  taskPriorityLabels,
  taskPriorityTone,
  taskStatusLabels,
  taskStatusTone,
} from '@/entities/task/model/task-meta';
import type { WorkspaceMember } from '@/entities/workspace/model/types';
import { CommentComposer } from '@/features/comment/add-comment/CommentComposer';
import { AssignUserSelect } from '@/features/task/assign-user/AssignUserSelect';
import { StatusSelect } from '@/features/task/change-status/StatusSelect';
import { formatDate } from '@/shared/lib/date';
import { Badge } from '@/shared/ui/Badge';
import { Card } from '@/shared/ui/Card';
import { Drawer } from '@/shared/ui/Drawer';
import { EmptyState } from '@/shared/ui/EmptyState';
import { LoadingState } from '@/shared/ui/LoadingState';

type TaskDetailsDrawerProps = {
  open: boolean;
  task: Task | null;
  members: WorkspaceMember[];
  comments: Comment[];
  commentsLoading: boolean;
  commentsError: string;
  mutationLoading: boolean;
  onClose: () => void;
  onAssignUser: (assigneeId: string) => void;
  onChangeStatus: (status: TaskStatus) => void;
  onAddComment: (payload: { content: string; authorId: string }) => Promise<void>;
};

export function TaskDetailsDrawer({
  open,
  task,
  members,
  comments,
  commentsLoading,
  commentsError,
  mutationLoading,
  onClose,
  onAssignUser,
  onChangeStatus,
  onAddComment,
}: TaskDetailsDrawerProps) {
  if (!task) {
    return null;
  }

  const author =
    members.find((member) => member.userId === task.authorId)?.user?.fullName ||
    task.authorId;
  const assignee =
    members.find((member) => member.userId === task.assigneeId)?.user?.fullName ||
    null;

  return (
    <Drawer
      open={open}
      title={task.title}
      description="Task execution details, ownership and comment stream."
      onClose={onClose}
    >
      <div className="task-details">
        <div className="task-details__meta">
          <Badge tone={taskStatusTone[task.status]}>
            {taskStatusLabels[task.status]}
          </Badge>
          <Badge tone={taskPriorityTone[task.priority]}>
            {taskPriorityLabels[task.priority]}
          </Badge>
          <span className="task-details__timestamp">
            Updated {formatDate(task.updatedAt)}
          </span>
        </div>

        <Card className="task-details__description">
          <p>{task.description}</p>
        </Card>

        <div className="task-details__grid">
          <Card className="task-details__panel">
            <StatusSelect
              status={task.status}
              submitting={mutationLoading}
              onChange={onChangeStatus}
            />
          </Card>
          <Card className="task-details__panel">
            <AssignUserSelect
              members={members}
              assigneeId={task.assigneeId}
              submitting={mutationLoading}
              onAssign={onAssignUser}
            />
          </Card>
        </div>

        <Card className="task-details__overview">
          <div>
            <span className="task-details__label">Author</span>
            <strong>{author}</strong>
          </div>
          <div>
            <span className="task-details__label">Assignee</span>
            <strong>{assignee || 'Unassigned'}</strong>
          </div>
          <div>
            <span className="task-details__label">Created</span>
            <strong>{formatDate(task.createdAt)}</strong>
          </div>
        </Card>

        <div className="task-details__comments">
          <div className="task-details__comments-header">
            <h4>Discussion</h4>
            <span>{comments.length} entries</span>
          </div>

          {commentsLoading ? (
            <LoadingState
              title="Loading comments"
              description="Pulling the latest discussion thread for this task."
            />
          ) : commentsError ? (
            <div className="form-error">{commentsError}</div>
          ) : comments.length ? (
            <div className="stack-list">
              {comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  authorName={
                    members.find((member) => member.userId === comment.authorId)?.user
                      ?.fullName || comment.authorId
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No comments yet"
              description="Use the thread below to add delivery context and progress updates."
            />
          )}
        </div>

        <Card className="task-details__composer">
          <CommentComposer
            members={members}
            submitting={mutationLoading}
            onSubmit={onAddComment}
          />
        </Card>
      </div>
    </Drawer>
  );
}
