import type {
  Workspace,
  WorkspaceMember,
  WorkspaceOverview,
} from 'entities/workspace/types';
import { apiRequest } from './client';

export const workspacesApi = {
  list() {
    return apiRequest<Workspace[]>('/workspaces');
  },
  create(data: { name: string; description: string }) {
    return apiRequest<Workspace>('/workspaces', {
      method: 'POST',
      json: data,
    });
  },
  getOverview(id: string) {
    return apiRequest<WorkspaceOverview>(`/bff/workspaces/${id}/overview`);
  },
  addMember(workspaceId: string, userId: string) {
    return apiRequest(`/workspaces/${workspaceId}/members`, {
      method: 'POST',
      json: { userId },
    });
  },
  listMembers(workspaceId: string) {
    return apiRequest<WorkspaceMember[]>(
      `/workspaces/${workspaceId}/members`,
    );
  },
  removeMember(workspaceId: string, userId: string) {
    return apiRequest(`/workspaces/${workspaceId}/members/${userId}`, {
      method: 'DELETE',
    });
  },
};
