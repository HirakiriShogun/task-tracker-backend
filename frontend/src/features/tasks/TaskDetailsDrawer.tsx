import { useEffect, useState } from 'react';
import type { TaskDetails } from 'entities/task/types';
import type { WorkspaceMember } from 'entities/workspace/types';
import { AddCommentForm } from 'features/comments/AddCommentForm';
import { commentsApi } from 'shared/api/comments';
import { tasksApi } from 'shared/api/tasks';
import {
  formatDateTime,
  formatTaskPriority,
  formatTaskStatus,
  getErrorText,
  getInitials,
} from 'shared/lib/format';
import { Badge } from 'shared/ui/Badge';
import { Button } from 'shared/ui/Button';
import { ErrorMessage } from 'shared/ui/ErrorMessage';
import { LoadingState } from 'shared/ui/LoadingState';
import { Modal } from 'shared/ui/Modal';
import { Select } from 'shared/ui/Select';

type TaskDetailsDrawerProps = {
  taskId: string | null;
  members: WorkspaceMember[];
  open: boolean;
  onClose: () => void;
  onTaskChanged: () => Promise<void>;
};

function getStatusTone(status: string) {
  if (status === 'DONE') {
    return 'green';
  }

  if (status === 'IN_PROGRESS') {
    return 'blue';
  }

  return 'amber';
}

function getPriorityTone(priority: string) {
  if (priority === 'HIGH') {
    return 'rose';
  }

  if (priority === 'MEDIUM') {
    return 'blue';
  }

  return 'neutral';
}

export function TaskDetailsDrawer({
  taskId,
  members,
  open,
  onClose,
  onTaskChanged,
}: TaskDetailsDrawerProps) {
  const [details, setDetails] = useState<TaskDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!taskId || !open) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await tasksApi.getDetails(taskId);

        if (!cancelled) {
          setDetails(response);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(getErrorText(loadError));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [open, taskId]);

  async function refreshDetails() {
    if (!taskId) {
      return;
    }

    const response = await tasksApi.getDetails(taskId);
    setDetails(response);
  }

  async function handleStatusChange(status: 'TODO' | 'IN_PROGRESS' | 'DONE') {
    if (!taskId) {
      return;
    }

    setWorking(true);

    try {
      await tasksApi.changeStatus(taskId, status);
      await Promise.all([refreshDetails(), onTaskChanged()]);
    } catch (changeError) {
      setError(getErrorText(changeError));
    } finally {
      setWorking(false);
    }
  }

  async function handleAssigneeChange(assigneeId: string) {
    if (!taskId || !assigneeId) {
      return;
    }

    setWorking(true);

    try {
      await tasksApi.assignUser(taskId, assigneeId);
      await Promise.all([refreshDetails(), onTaskChanged()]);
    } catch (assignError) {
      setError(getErrorText(assignError));
    } finally {
      setWorking(false);
    }
  }

  async function handleCommentSubmit(content: string) {
    if (!taskId) {
      return;
    }

    await commentsApi.add({ content, taskId });
    await Promise.all([refreshDetails(), onTaskChanged()]);
  }

  return (
    <Modal
      description="Все изменения применяются сразу и обновляют карточку."
      mode="side"
      onClose={onClose}
      open={open}
      title={details?.task.title ?? 'Задача'}
    >
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => void refreshDetails()} />
      ) : details ? (
        <div className="stack-xl">
          <div className="stack-md">
            <div className="task-drawer__badges">
              <Badge tone={getStatusTone(details.task.status)}>
                {formatTaskStatus(details.task.status)}
              </Badge>
              <Badge tone={getPriorityTone(details.task.priority)}>
                {formatTaskPriority(details.task.priority)}
              </Badge>
            </div>
            <p className="task-drawer__description">
              {details.task.description}
            </p>
          </div>

          <div className="info-grid">
            <div className="info-tile">
              <span>Автор</span>
              <strong>{details.author.fullName}</strong>
              <small>{details.author.email}</small>
            </div>
            <div className="info-tile">
              <span>Исполнитель</span>
              <strong>{details.assignee?.fullName ?? 'Не назначен'}</strong>
              <small>
                {details.assignee?.email ?? 'Выбери участника ниже'}
              </small>
            </div>
            <div className="info-tile">
              <span>Проект</span>
              <strong>{details.project.name}</strong>
              <small>{details.workspace.name}</small>
            </div>
            <div className="info-tile">
              <span>Создано</span>
              <strong>{formatDateTime(details.task.createdAt)}</strong>
              <small>Обновлено {formatDateTime(details.task.updatedAt)}</small>
            </div>
          </div>

          <div className="stack-md">
            <div className="inline-fields">
              <Select
                label="Статус"
                onChange={(event) =>
                  void handleStatusChange(
                    event.target.value as 'TODO' | 'IN_PROGRESS' | 'DONE',
                  )
                }
                value={details.task.status}
              >
                <option value="TODO">К выполнению</option>
                <option value="IN_PROGRESS">В работе</option>
                <option value="DONE">Готово</option>
              </Select>
              <Select
                label="Исполнитель"
                onChange={(event) => void handleAssigneeChange(event.target.value)}
                value={details.task.assigneeId ?? ''}
              >
                <option disabled value="">
                  Выбери участника
                </option>
                {members.map((member) => (
                  <option key={member.userId} value={member.userId}>
                    {member.user.fullName}
                  </option>
                ))}
              </Select>
            </div>
            {working ? (
              <div className="subtle-state">Применяем изменения...</div>
            ) : null}
          </div>

          <section className="stack-lg">
            <div className="comments-header">
              <div>
                <span className="section-kicker">Обсуждение</span>
                <h3>Комментарии</h3>
              </div>
              <Badge tone="blue">{details.comments.length}</Badge>
            </div>

            <div className="comments-list">
              {details.comments.map((comment) => (
                <article className="comment-card" key={comment.id}>
                  <div className="comment-card__avatar">
                    {getInitials(comment.author.fullName)}
                  </div>
                  <div className="comment-card__body">
                    <div className="comment-card__meta">
                      <strong>{comment.author.fullName}</strong>
                      <span>{formatDateTime(comment.createdAt)}</span>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                </article>
              ))}
            </div>

            <AddCommentForm onSubmit={handleCommentSubmit} />
          </section>

          <div className="modal-actions">
            <Button onClick={onClose} type="button" variant="ghost">
              Закрыть
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
