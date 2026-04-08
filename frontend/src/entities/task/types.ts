import type { SafeUser } from 'entities/auth/types';
import type { Comment } from 'entities/comment/types';
import type { Project } from 'entities/project/types';
import type { Workspace } from 'entities/workspace/types';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export type TaskDetails = {
  task: {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    projectId: string;
    authorId: string;
    assigneeId: string | null;
    createdAt: string;
    updatedAt: string;
  };
  author: SafeUser;
  assignee: SafeUser | null;
  project: Project;
  workspace: Workspace;
  comments: Comment[];
};
