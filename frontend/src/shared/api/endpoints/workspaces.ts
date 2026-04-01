import type { Project } from '@/entities/project/model/types';
import type {
  Workspace,
  WorkspaceMember,
} from '@/entities/workspace/model/types';
import { apiClient } from '../client';

type CreateWorkspacePayload = {
  name: string;
  description: string;
  creatorId: string;
};

type AddWorkspaceMemberPayload = {
  userId: string;
};

export const workspacesApi = {
  list: () => apiClient.get<Workspace[]>('/workspaces'),
  getById: (id: string) => apiClient.get<Workspace>(`/workspaces/${id}`),
  create: (payload: CreateWorkspacePayload) =>
    apiClient.post<Workspace>('/workspaces', payload),
  listMembers: (workspaceId: string) =>
    apiClient.get<WorkspaceMember[]>(`/workspaces/${workspaceId}/members`),
  addMember: (workspaceId: string, payload: AddWorkspaceMemberPayload) =>
    apiClient.post<WorkspaceMember>(
      `/workspaces/${workspaceId}/members`,
      payload,
    ),
  removeMember: (workspaceId: string, userId: string) =>
    apiClient.delete<WorkspaceMember>(
      `/workspaces/${workspaceId}/members/${userId}`,
    ),
  listProjects: (workspaceId: string) =>
    apiClient.get<Project[]>(`/workspaces/${workspaceId}/projects`),
};
