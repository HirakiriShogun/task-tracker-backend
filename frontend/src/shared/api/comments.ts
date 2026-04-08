import type { Comment } from 'entities/comment/types';
import { apiRequest } from './client';

export const commentsApi = {
  add(data: { content: string; taskId: string }) {
    return apiRequest<Comment>('/comments', {
      method: 'POST',
      json: data,
    });
  },
};
