import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Project } from '@/entities/project/model/types';
import type { Task } from '@/entities/task/model/types';
import type { User } from '@/entities/user/model/types';
import type {
  Workspace,
  WorkspaceMember,
} from '@/entities/workspace/model/types';
import { useTaskTrackerStore } from '@/app/store/use-task-tracker-store';
import { CreateProjectModal } from '@/features/project/create-project/CreateProjectModal';
import { AddMemberModal } from '@/features/workspace/add-member/AddMemberModal';
import { tasksApi } from '@/shared/api/endpoints/tasks';
import { usersApi } from '@/shared/api/endpoints/users';
import { workspacesApi } from '@/shared/api/endpoints/workspaces';
import { getErrorMessage } from '@/shared/lib/errors';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import { WorkspaceMembersPanel } from '@/widgets/workspace-details/WorkspaceMembersPanel';
import { WorkspaceProjectsPanel } from '@/widgets/workspace-details/WorkspaceProjectsPanel';

export function WorkspaceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setCurrentWorkspace, resetProjectContext } = useTaskTrackerStore();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const loadData = async () => {
    if (!id) {
      return;
    }

    setLoading(true);

    try {
      const [workspaceData, projectList, memberList, userList, taskList] =
        await Promise.all([
          workspacesApi.getById(id),
          workspacesApi.listProjects(id),
          workspacesApi.listMembers(id),
          usersApi.list(),
          tasksApi.list(),
        ]);

      setWorkspace(workspaceData);
      setProjects(projectList);
      setMembers(memberList);
      setUsers(userList);
      setTasks(taskList);
      setCurrentWorkspace({ id: workspaceData.id, name: workspaceData.name });
      resetProjectContext();
      setError('');
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [id]);

  if (loading) {
    return <LoadingState title="Loading workspace" description="Gathering projects, teammates and delivery metrics." />;
  }

  if (error || !workspace) {
    return (
      <ErrorState
        message={error || 'Workspace not found'}
        action={
          <Button type="button" variant="secondary" onClick={() => void loadData()}>
            Retry
          </Button>
        }
      />
    );
  }

  const availableUsers = users.filter(
    (user) => !members.some((member) => member.userId === user.id),
  );

  const taskCounts = projects.reduce<Record<string, number>>((acc, project) => {
    acc[project.id] = tasks.filter((task) => task.projectId === project.id).length;
    return acc;
  }, {});

  return (
    <div className="page-stack">
      <section className="workspace-hero">
        <div className="workspace-hero__main">
          <span className="hero-panel__eyebrow">Workspace detail</span>
          <h2>{workspace.name}</h2>
          <p>{workspace.description}</p>
        </div>
        <div className="workspace-hero__stats">
          <Badge tone="accent">{projects.length} projects</Badge>
          <Badge tone="success">{members.length} members</Badge>
          <Button type="button" onClick={() => setIsProjectModalOpen(true)}>
            Create project
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsMemberModalOpen(true)}
          >
            Add member
          </Button>
        </div>
      </section>

      <div className="content-grid">
        <section className="content-panel">
          <SectionHeader
            eyebrow="Projects"
            title="Execution streams"
            description="Open a project to see its tasks, statuses and team activity."
          />
          <WorkspaceProjectsPanel projects={projects} taskCounts={taskCounts} />
        </section>

        <section className="content-panel">
          <SectionHeader
            eyebrow="Members"
            title="Workspace people"
            description="Keep the contributor list close to the work context."
          />
          <WorkspaceMembersPanel
            members={members}
            onRemove={(member) => {
              void workspacesApi
                .removeMember(workspace.id, member.userId)
                .then(() => loadData())
                .catch((removeError) => setError(getErrorMessage(removeError)));
            }}
          />
        </section>
      </div>

      <AddMemberModal
        open={isMemberModalOpen}
        workspaceId={workspace.id}
        users={availableUsers}
        onClose={() => setIsMemberModalOpen(false)}
        onAdded={() => void loadData()}
      />

      <CreateProjectModal
        open={isProjectModalOpen}
        workspaceId={workspace.id}
        members={members}
        onClose={() => setIsProjectModalOpen(false)}
        onCreated={(project) => {
          void loadData();
          navigate(`/projects/${project.id}`);
        }}
      />
    </div>
  );
}
