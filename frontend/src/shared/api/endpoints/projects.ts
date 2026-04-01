import type { Project } from '@/entities/project/model/types';
import { apiClient } from '../client';

type CreateProjectPayload = {
  name: string;
  description: string;
  workspaceId: string;
  creatorId: string;
};

export const projectsApi = {
  list: () => apiClient.get<Project[]>('/projects'),
  getById: (id: string) => apiClient.get<Project>(`/projects/${id}`),
  create: (payload: CreateProjectPayload) =>
    apiClient.post<Project>('/projects', payload),
};
