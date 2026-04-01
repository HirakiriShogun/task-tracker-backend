import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '@/entities/project/model/types';
import type { User } from '@/entities/user/model/types';
import type { Workspace } from '@/entities/workspace/model/types';
import { useTaskTrackerStore } from '@/app/store/use-task-tracker-store';
import { CreateWorkspaceModal } from '@/features/workspace/create-workspace/CreateWorkspaceModal';
import { projectsApi } from '@/shared/api/endpoints/projects';
import { usersApi } from '@/shared/api/endpoints/users';
import { workspacesApi } from '@/shared/api/endpoints/workspaces';
import { getErrorMessage } from '@/shared/lib/errors';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import { WorkspaceGrid } from '@/widgets/workspace-grid/WorkspaceGrid';

export function WorkspacesPage() {
  const navigate = useNavigate();
  const { setCurrentWorkspace, resetProjectContext } = useTaskTrackerStore();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);

    try {
      const [workspaceList, userList, projectList] = await Promise.all([
        workspacesApi.list(),
        usersApi.list(),
        projectsApi.list(),
      ]);

      setWorkspaces(workspaceList);
      setUsers(userList);
      setProjects(projectList);
      setError('');
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentWorkspace(null);
    resetProjectContext();
    void loadData();
  }, [resetProjectContext, setCurrentWorkspace]);

  if (loading) {
    return <LoadingState title="Loading workspaces" description="Preparing your teams, projects and space overview." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        action={
          <Button type="button" variant="secondary" onClick={() => void loadData()}>
            Retry
          </Button>
        }
      />
    );
  }

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-panel__copy">
          <span className="hero-panel__eyebrow">Workspace HQ</span>
          <h2>Organize teams, projects and execution streams in one polished surface.</h2>
          <p>
            Build a focused operating layer for delivery work with crisp context,
            fast entry points and a premium SaaS feel.
          </p>
        </div>
        <div className="hero-panel__metrics">
          <div className="metric-card">
            <strong>{workspaces.length}</strong>
            <span>Workspaces</span>
          </div>
          <div className="metric-card">
            <strong>{projects.length}</strong>
            <span>Projects</span>
          </div>
          <div className="metric-card">
            <strong>{users.length}</strong>
            <span>Users</span>
          </div>
          <Button type="button" onClick={() => setIsCreateModalOpen(true)}>
            Create workspace
          </Button>
        </div>
      </section>

      <SectionHeader
        eyebrow="All spaces"
        title="Workspace gallery"
        description="Open a space to manage its members, projects and task flow."
      />

      {workspaces.length ? (
        <WorkspaceGrid workspaces={workspaces} projects={projects} />
      ) : (
        <EmptyState
          title="No workspaces yet"
          description="Create the first workspace to start shaping projects, team membership and task delivery."
          action={
            <Button type="button" onClick={() => setIsCreateModalOpen(true)}>
              Create the first workspace
            </Button>
          }
        />
      )}

      <CreateWorkspaceModal
        open={isCreateModalOpen}
        users={users}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(workspace) => {
          void loadData();
          navigate(`/workspaces/${workspace.id}`);
        }}
      />
    </div>
  );
}
