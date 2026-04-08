import type { Project, ProjectOverview } from 'entities/project/types';
import { apiRequest } from './client';

export const projectsApi = {
  create(data: { name: string; description: string; workspaceId: string }) {
    return apiRequest<Project>('/projects', {
      method: 'POST',
      json: data,
    });
  },
  getOverview(id: string) {
    return apiRequest<ProjectOverview>(`/bff/projects/${id}/overview`);
  },
};
