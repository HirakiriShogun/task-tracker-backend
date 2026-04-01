import type { User } from '@/entities/user/model/types';
import { apiClient } from '../client';

export const usersApi = {
  list: () => apiClient.get<User[]>('/users'),
};
