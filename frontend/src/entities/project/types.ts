import type { Workspace } from 'entities/workspace/types';

export type Project = {
  id: string;
  name: string;
  description: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectOverview = {
  project: Project;
  workspace: Workspace;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    projectId: string;
    authorId: string;
    assigneeId: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  counts: {
    tasks: number;
    tasksByStatus: {
      TODO: number;
      IN_PROGRESS: number;
      DONE: number;
    };
    tasksByPriority: {
      LOW: number;
      MEDIUM: number;
      HIGH: number;
    };
  };
};
