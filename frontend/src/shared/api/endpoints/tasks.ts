import type { Task, TaskStatus } from '@/entities/task/model/types';
import { apiClient } from '../client';

type CreateTaskPayload = {
  title: string;
  description: string;
  projectId: string;
  authorId: string;
};

export const tasksApi = {
  list: () => apiClient.get<Task[]>('/tasks'),
  getById: (id: string) => apiClient.get<Task>(`/tasks/${id}`),
  listByProject: (projectId: string) =>
    apiClient.get<Task[]>(`/projects/${projectId}/tasks`),
  create: (payload: CreateTaskPayload) =>
    apiClient.post<Task>('/tasks', payload),
  assignUser: (taskId: string, assigneeId: string) =>
    apiClient.patch<Task>(`/tasks/${taskId}/assign`, { assigneeId }),
  changeStatus: (taskId: string, status: TaskStatus) =>
    apiClient.patch<Task>(`/tasks/${taskId}/status`, { status }),
};
