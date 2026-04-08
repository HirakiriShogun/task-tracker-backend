import type { SafeUser } from 'entities/auth/types';

export type Workspace = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceMember = {
  id: string;
  userId: string;
  workspaceId: string;
  joinedAt: string;
  user: SafeUser;
};

export type WorkspaceOverview = {
  workspace: Workspace;
  members: WorkspaceMember[];
  projects: Array<{
    id: string;
    name: string;
    description: string;
    workspaceId: string;
    createdAt: string;
    updatedAt: string;
    taskCount: number;
  }>;
  counts: {
    projects: number;
    tasks: number;
    tasksByStatus: {
      TODO: number;
      IN_PROGRESS: number;
      DONE: number;
    };
  };
};
