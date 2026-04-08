import type { TaskDetails, TaskStatus } from 'entities/task/types';
import { apiRequest } from './client';

export const tasksApi = {
  create(data: {
    title: string;
    description: string;
    projectId: string;
  }) {
    return apiRequest('/tasks', {
      method: 'POST',
      json: data,
    });
  },
  getDetails(id: string) {
    return apiRequest<TaskDetails>(`/bff/tasks/${id}/details`);
  },
  assignUser(taskId: string, assigneeId: string) {
    return apiRequest(`/tasks/${taskId}/assign`, {
      method: 'PATCH',
      json: { assigneeId },
    });
  },
  changeStatus(taskId: string, status: TaskStatus) {
    return apiRequest(`/tasks/${taskId}/status`, {
      method: 'PATCH',
      json: { status },
    });
  },
};
