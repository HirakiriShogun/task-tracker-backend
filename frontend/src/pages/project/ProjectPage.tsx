import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ProjectOverview } from 'entities/project/types';
import type { WorkspaceMember } from 'entities/workspace/types';
import { CreateTaskModal } from 'features/tasks/CreateTaskModal';
import { TaskDetailsDrawer } from 'features/tasks/TaskDetailsDrawer';
import { projectsApi } from 'shared/api/projects';
import { tasksApi } from 'shared/api/tasks';
import { workspacesApi } from 'shared/api/workspaces';
import {
  formatDateTime,
  formatTaskPriority,
  formatTaskStatus,
  getErrorText,
} from 'shared/lib/format';
import { Badge } from 'shared/ui/Badge';
import { Button } from 'shared/ui/Button';
import { Card } from 'shared/ui/Card';
import { EmptyState } from 'shared/ui/EmptyState';
import { ErrorMessage } from 'shared/ui/ErrorMessage';
import { LoadingState } from 'shared/ui/LoadingState';
import { PageFrame } from 'shared/ui/PageFrame';
import { SectionHeader } from 'shared/ui/SectionHeader';

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

export function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [overview, setOverview] = useState<ProjectOverview | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  async function loadPage() {
    if (!id) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const projectOverview = await projectsApi.getOverview(id);
      const workspaceMembers = await workspacesApi.listMembers(
        projectOverview.workspace.id,
      );
      setOverview(projectOverview);
      setMembers(workspaceMembers);
    } catch (loadError) {
      setError(getErrorText(loadError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPage();
  }, [id]);

  async function handleCreateTask(payload: {
    title: string;
    description: string;
  }) {
    if (!id) {
      return;
    }

    await tasksApi.create({
      ...payload,
      projectId: id,
    });
    await loadPage();
  }

  function getMemberName(userId: string | null) {
    if (!userId) {
      return 'Не назначен';
    }

    return (
      members.find((member) => member.userId === userId)?.user.fullName ??
      'Участник пространства'
    );
  }

  const hero = overview ? (
    <div className="hero hero--project">
      <div className="hero__copy">
        <button
          className="back-link"
          onClick={() => navigate(`/workspaces/${overview.workspace.id}`)}
          type="button"
        >
          ← Назад к пространству
        </button>
        <span className="hero__eyebrow">Проект</span>
        <h2>{overview.project.name}</h2>
        <p>{overview.project.description}</p>
      </div>
      <div className="hero__metrics hero__metrics--project">
        <Card className="metric-card">
          <span>Задач</span>
          <strong>{overview.counts.tasks}</strong>
        </Card>
        <Card className="metric-card">
          <span>В работе</span>
          <strong>{overview.counts.tasksByStatus.IN_PROGRESS}</strong>
        </Card>
        <Card className="metric-card">
          <span>Готово</span>
          <strong>{overview.counts.tasksByStatus.DONE}</strong>
        </Card>
      </div>
    </div>
  ) : (
    <div className="hero">
      <LoadingState compact />
    </div>
  );

  return (
    <>
      <PageFrame header={hero}>
        {loading && !overview ? <LoadingState /> : null}
        {error ? <ErrorMessage message={error} onRetry={() => void loadPage()} /> : null}

        {overview ? (
          <div className="stack-xl">
            <section className="panel-section">
              <SectionHeader
                actions={
                  <Button onClick={() => setCreateOpen(true)} type="button">
                    Создать задачу
                  </Button>
                }
                description="Открой задачу, чтобы поменять статус, исполнителя и обсуждение."
                eyebrow="Работа"
                title="Задачи"
              />

              {overview.tasks.length === 0 ? (
                <EmptyState
                  action={
                    <Button onClick={() => setCreateOpen(true)} type="button">
                      Создать первую задачу
                    </Button>
                  }
                  description="Добавь первую задачу в этот проект."
                  title="Задач пока нет"
                />
              ) : (
                <div className="task-list">
                  {overview.tasks.map((task) => (
                    <Card
                      className="task-row"
                      interactive
                      key={task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="task-row__main">
                        <div className="task-row__badges">
                          <Badge tone={getStatusTone(task.status)}>
                            {formatTaskStatus(task.status)}
                          </Badge>
                          <Badge tone={getPriorityTone(task.priority)}>
                            {formatTaskPriority(task.priority)}
                          </Badge>
                        </div>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                      </div>
                      <div className="task-row__meta">
                        <span>{getMemberName(task.assigneeId)}</span>
                        <small>{formatDateTime(task.updatedAt)}</small>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            <section className="panel-section">
              <SectionHeader
                description="Текущее распределение задач по статусам и приоритетам."
                eyebrow="Сводка"
                title="Состояние проекта"
              />
              <div className="status-strip">
                <Card className="status-strip__card">
                  <span>К выполнению</span>
                  <strong>{overview.counts.tasksByStatus.TODO}</strong>
                </Card>
                <Card className="status-strip__card">
                  <span>В работе</span>
                  <strong>{overview.counts.tasksByStatus.IN_PROGRESS}</strong>
                </Card>
                <Card className="status-strip__card">
                  <span>Готово</span>
                  <strong>{overview.counts.tasksByStatus.DONE}</strong>
                </Card>
                <Card className="status-strip__card">
                  <span>Высокий приоритет</span>
                  <strong>{overview.counts.tasksByPriority.HIGH}</strong>
                </Card>
              </div>
            </section>
          </div>
        ) : null}
      </PageFrame>

      <CreateTaskModal
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateTask}
        open={createOpen}
      />

      <TaskDetailsDrawer
        members={members}
        onClose={() => setSelectedTaskId(null)}
        onTaskChanged={loadPage}
        open={selectedTaskId !== null}
        taskId={selectedTaskId}
      />
    </>
  );
}
