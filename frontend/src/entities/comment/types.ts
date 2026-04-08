import type { SafeUser } from 'entities/auth/types';

export type Comment = {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: SafeUser;
};
