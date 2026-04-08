import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from 'app/store/workspace-store';
import { CreateWorkspaceModal } from 'features/workspaces/CreateWorkspaceModal';
import { workspacesApi } from 'shared/api/workspaces';
import { formatDate } from 'shared/lib/format';
import { Badge } from 'shared/ui/Badge';
import { Button } from 'shared/ui/Button';
import { Card } from 'shared/ui/Card';
import { EmptyState } from 'shared/ui/EmptyState';
import { ErrorMessage } from 'shared/ui/ErrorMessage';
import { LoadingState } from 'shared/ui/LoadingState';
import { PageFrame } from 'shared/ui/PageFrame';
import { SectionHeader } from 'shared/ui/SectionHeader';

export function WorkspacesPage() {
  const navigate = useNavigate();
  const items = useWorkspaceStore((state) => state.items);
  const loading = useWorkspaceStore((state) => state.loading);
  const error = useWorkspaceStore((state) => state.error);
  const load = useWorkspaceStore((state) => state.load);
  const prepend = useWorkspaceStore((state) => state.prepend);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCreate(payload: { name: string; description: string }) {
    const workspace = await workspacesApi.create(payload);
    prepend(workspace);
    navigate(`/workspaces/${workspace.id}`);
  }

  return (
    <>
      <PageFrame
        header={
          <div className="hero hero--workspaces">
            <div className="hero__copy">
              <span className="hero__eyebrow">Главная</span>
              <h2>Все рабочие пространства под рукой.</h2>
              <p>Открой текущее пространство или создай новое.</p>
            </div>
            <div className="hero__stats">
              <Card className="stat-card">
                <span>Пространств</span>
                <strong>{items.length}</strong>
                <small>Доступ только по защищённой сессии</small>
              </Card>
              <Button onClick={() => setCreateOpen(true)} type="button">
                Создать пространство
              </Button>
            </div>
          </div>
        }
      >
        <SectionHeader
          description="Кликни по карточке, чтобы перейти внутрь."
          eyebrow="Список"
          title="Рабочие пространства"
        />

        {loading && items.length === 0 ? <LoadingState /> : null}
        {error ? <ErrorMessage message={error} onRetry={() => void load()} /> : null}

        {!loading && !error && items.length === 0 ? (
          <EmptyState
            action={
                  <Button onClick={() => setCreateOpen(true)} type="button">
                Создать первое пространство
              </Button>
            }
            description="Добавь пространство, чтобы начать работу с проектами и задачами."
            title="Пока нет пространств"
          />
        ) : null}

        <div className="workspace-grid">
          {items.map((workspace) => (
            <Card
              className="workspace-card"
              interactive
              key={workspace.id}
              onClick={() => navigate(`/workspaces/${workspace.id}`)}
              role="button"
              tabIndex={0}
            >
              <div className="workspace-card__meta">
                <Badge tone="blue">Пространство</Badge>
                <span>{formatDate(workspace.createdAt)}</span>
              </div>
              <h3>{workspace.name}</h3>
              <p>{workspace.description}</p>
              <div className="workspace-card__footer">
                <span>Открыть</span>
                <strong>→</strong>
              </div>
            </Card>
          ))}
        </div>
      </PageFrame>

      <CreateWorkspaceModal
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        open={createOpen}
      />
    </>
  );
}
