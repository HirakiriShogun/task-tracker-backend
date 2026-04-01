import type { User } from '@/entities/user/model/types';

export type Workspace = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceMember = {
  id: string;
  userId: string;
  workspaceId: string;
  joinedAt: string;
  user?: User;
};
