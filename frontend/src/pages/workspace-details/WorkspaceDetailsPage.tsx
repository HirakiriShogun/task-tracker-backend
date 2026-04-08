import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { WorkspaceOverview } from 'entities/workspace/types';
import { CreateProjectModal } from 'features/projects/CreateProjectModal';
import { AddMemberModal } from 'features/workspace-members/AddMemberModal';
import { projectsApi } from 'shared/api/projects';
import { workspacesApi } from 'shared/api/workspaces';
import { formatDate, getErrorText, getInitials } from 'shared/lib/format';
import { Badge } from 'shared/ui/Badge';
import { Button } from 'shared/ui/Button';
import { Card } from 'shared/ui/Card';
import { EmptyState } from 'shared/ui/EmptyState';
import { ErrorMessage } from 'shared/ui/ErrorMessage';
import { LoadingState } from 'shared/ui/LoadingState';
import { PageFrame } from 'shared/ui/PageFrame';
import { SectionHeader } from 'shared/ui/SectionHeader';

export function WorkspaceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [overview, setOverview] = useState<WorkspaceOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectOpen, setProjectOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);

  async function loadOverview() {
    if (!id) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await workspacesApi.getOverview(id);
      setOverview(response);
    } catch (loadError) {
      setError(getErrorText(loadError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadOverview();
  }, [id]);

  async function handleCreateProject(payload: {
    name: string;
    description: string;
  }) {
    if (!id) {
      return;
    }

    const project = await projectsApi.create({
      ...payload,
      workspaceId: id,
    });
    await loadOverview();
    navigate(`/projects/${project.id}`);
  }

  async function handleAddMember(userId: string) {
    if (!id) {
      return;
    }

    await workspacesApi.addMember(id, userId);
    await loadOverview();
  }

  async function handleRemoveMember(userId: string) {
    if (!id) {
      return;
    }

    await workspacesApi.removeMember(id, userId);
    await loadOverview();
  }

  const hero = overview ? (
    <div className="hero hero--workspace-details">
      <div className="hero__copy">
        <span className="hero__eyebrow">Пространство</span>
        <h2>{overview.workspace.name}</h2>
        <p>{overview.workspace.description}</p>
      </div>
      <div className="hero__metrics">
        <Card className="metric-card">
          <span>Проектов</span>
          <strong>{overview.counts.projects}</strong>
        </Card>
        <Card className="metric-card">
          <span>Задач</span>
          <strong>{overview.counts.tasks}</strong>
        </Card>
        <Card className="metric-card">
          <span>Участников</span>
          <strong>{overview.members.length}</strong>
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
        {error ? (
          <ErrorMessage message={error} onRetry={() => void loadOverview()} />
        ) : null}

        {overview ? (
          <div className="stack-xl">
            <section className="panel-section">
              <SectionHeader
                actions={
                  <div className="inline-actions">
                    <Button
                      onClick={() => setMemberOpen(true)}
                      type="button"
                      variant="secondary"
                    >
                      Добавить участника
                    </Button>
                    <Button onClick={() => setProjectOpen(true)} type="button">
                      Создать проект
                    </Button>
                  </div>
                }
                description="Здесь собраны все проекты текущего пространства."
                eyebrow="Структура"
                title="Проекты"
              />

              {overview.projects.length === 0 ? (
                <EmptyState
                  action={
                    <Button onClick={() => setProjectOpen(true)} type="button">
                      Создать проект
                    </Button>
                  }
                  description="Создай первый проект и начни работу."
                  title="Проектов пока нет"
                />
              ) : (
                <div className="project-grid">
                  {overview.projects.map((project) => (
                    <Card
                      className="project-card"
                      interactive
                      key={project.id}
                      onClick={() => navigate(`/projects/${project.id}`)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="project-card__header">
                        <Badge tone="blue">{project.taskCount} задач</Badge>
                        <span>{formatDate(project.createdAt)}</span>
                      </div>
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                      <div className="workspace-card__footer">
                        <span>Открыть проект</span>
                        <strong>→</strong>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            <section className="panel-section">
              <SectionHeader
                description="Участники пространства могут работать с проектами и задачами."
                eyebrow="Команда"
                title="Участники"
              />

              <div className="member-grid">
                {overview.members.map((member) => (
                  <Card className="member-card" key={member.id}>
                    <div className="member-card__avatar">
                      {getInitials(member.user.fullName)}
                    </div>
                    <div className="member-card__copy">
                      <strong>{member.user.fullName}</strong>
                      <span>{member.user.email}</span>
                      <code>{member.user.id}</code>
                    </div>
                    <div className="member-card__actions">
                      <Badge tone="green">Активен</Badge>
                      <Button
                        onClick={() => void handleRemoveMember(member.userId)}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        Удалить
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <section className="panel-section">
              <SectionHeader
                description="Сводка по задачам всего пространства."
                eyebrow="Сводка"
                title="Статусы задач"
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
              </div>
            </section>
          </div>
        ) : null}
      </PageFrame>

      <CreateProjectModal
        onClose={() => setProjectOpen(false)}
        onSubmit={handleCreateProject}
        open={projectOpen}
      />
      <AddMemberModal
        onClose={() => setMemberOpen(false)}
        onSubmit={handleAddMember}
        open={memberOpen}
      />
    </>
  );
}
