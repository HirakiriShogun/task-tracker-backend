import type { Comment } from '@/entities/comment/model/types';
import { apiClient } from '../client';

type AddCommentPayload = {
  content: string;
  taskId: string;
  authorId: string;
};

export const commentsApi = {
  listByTask: (taskId: string) =>
    apiClient.get<Comment[]>(`/tasks/${taskId}/comments`),
  create: (payload: AddCommentPayload) =>
    apiClient.post<Comment>('/comments', payload),
};
