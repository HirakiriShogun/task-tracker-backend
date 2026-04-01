import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Comment } from '@/entities/comment/model/types';
import type { Project } from '@/entities/project/model/types';
import type { Task, TaskStatus } from '@/entities/task/model/types';
import type {
  Workspace,
  WorkspaceMember,
} from '@/entities/workspace/model/types';
import { useTaskTrackerStore } from '@/app/store/use-task-tracker-store';
import { CreateTaskModal } from '@/features/task/create-task/CreateTaskModal';
import { commentsApi } from '@/shared/api/endpoints/comments';
import { projectsApi } from '@/shared/api/endpoints/projects';
import { tasksApi } from '@/shared/api/endpoints/tasks';
import { workspacesApi } from '@/shared/api/endpoints/workspaces';
import { getErrorMessage } from '@/shared/lib/errors';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import { TaskBoard } from '@/widgets/project-tasks/TaskBoard';
import { TaskDetailsDrawer } from '@/widgets/task-details/TaskDetailsDrawer';

export function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const {
    selectedTaskId,
    setCurrentWorkspace,
    setCurrentProject,
    setSelectedTaskId,
  } = useTaskTrackerStore();
  const [project, setProject] = useState<Project | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState('');
  const [mutationLoading, setMutationLoading] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null;

  const loadTasks = async (projectId: string) => {
    const taskList = await tasksApi.listByProject(projectId);
    setTasks(taskList);
  };

  const loadProjectData = async () => {
    if (!id) {
      return;
    }

    setLoading(true);

    try {
      const projectData = await projectsApi.getById(id);
      const [workspaceData, memberList, taskList] = await Promise.all([
        workspacesApi.getById(projectData.workspaceId),
        workspacesApi.listMembers(projectData.workspaceId),
        tasksApi.listByProject(projectData.id),
      ]);

      setProject(projectData);
      setWorkspace(workspaceData);
      setMembers(memberList);
      setTasks(taskList);
      setCurrentProject({ id: projectData.id, name: projectData.name });
      setCurrentWorkspace({ id: workspaceData.id, name: workspaceData.name });
      setError('');
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (taskId: string) => {
    setCommentsLoading(true);

    try {
      const commentList = await commentsApi.listByTask(taskId);
      setComments(commentList);
      setCommentsError('');
    } catch (loadError) {
      setCommentsError(getErrorMessage(loadError));
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    void loadProjectData();
  }, [id]);

  useEffect(() => {
    if (selectedTaskId) {
      void loadComments(selectedTaskId);
    } else {
      setComments([]);
      setCommentsError('');
    }
  }, [selectedTaskId]);

  if (loading) {
    return <LoadingState title="Loading project" description="Pulling tasks, people and workspace context into view." />;
  }

  if (error || !project || !workspace) {
    return (
      <ErrorState
        message={error || 'Project not found'}
        action={
          <Button type="button" variant="secondary" onClick={() => void loadProjectData()}>
            Retry
          </Button>
        }
      />
    );
  }

  const completedTasks = tasks.filter((task) => task.status === 'DONE').length;
  const inProgressTasks = tasks.filter((task) => task.status === 'IN_PROGRESS').length;

  return (
    <div className="page-stack">
      <section className="project-hero">
        <div className="project-hero__copy">
          <span className="hero-panel__eyebrow">Project view</span>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
        </div>
        <div className="project-hero__stats">
          <Badge tone="accent">{workspace.name}</Badge>
          <Badge tone="neutral">{tasks.length} tasks</Badge>
          <Badge tone="success">{completedTasks} done</Badge>
          <Badge tone="warning">{inProgressTasks} active</Badge>
          <Button type="button" onClick={() => setIsTaskModalOpen(true)}>
            Create task
          </Button>
        </div>
      </section>

      <section className="content-panel">
        <SectionHeader
          eyebrow="Task flow"
          title="Execution board"
          description="Open a task to reassign ownership, move status and continue the discussion."
        />
        <TaskBoard
          tasks={tasks}
          members={members}
          onOpenTask={(taskId) => setSelectedTaskId(taskId)}
        />
      </section>

      <TaskDetailsDrawer
        open={Boolean(selectedTask)}
        task={selectedTask}
        members={members}
        comments={comments}
        commentsLoading={commentsLoading}
        commentsError={commentsError}
        mutationLoading={mutationLoading}
        onClose={() => setSelectedTaskId(null)}
        onAssignUser={(assigneeId) => {
          if (!selectedTask) {
            return;
          }

          setMutationLoading(true);
          void tasksApi
            .assignUser(selectedTask.id, assigneeId)
            .then(async () => {
              await loadTasks(project.id);
            })
            .catch((assignError) => setCommentsError(getErrorMessage(assignError)))
            .finally(() => setMutationLoading(false));
        }}
        onChangeStatus={(status: TaskStatus) => {
          if (!selectedTask) {
            return;
          }

          setMutationLoading(true);
          void tasksApi
            .changeStatus(selectedTask.id, status)
            .then(async () => {
              await loadTasks(project.id);
            })
            .catch((statusError) => setCommentsError(getErrorMessage(statusError)))
            .finally(() => setMutationLoading(false));
        }}
        onAddComment={async ({ content, authorId }) => {
          if (!selectedTask) {
            return;
          }

          setMutationLoading(true);

          try {
            await commentsApi.create({
              content,
              taskId: selectedTask.id,
              authorId,
            });
            await loadComments(selectedTask.id);
          } catch (commentError) {
            setCommentsError(getErrorMessage(commentError));
          } finally {
            setMutationLoading(false);
          }
        }}
      />

      <CreateTaskModal
        open={isTaskModalOpen}
        projectId={project.id}
        members={members}
        onClose={() => setIsTaskModalOpen(false)}
        onCreated={async (task) => {
          await loadTasks(project.id);
          setSelectedTaskId(task.id);
        }}
      />
    </div>
  );
}
