import type { AuthResponse, SafeUser } from 'entities/auth/types';
import { apiRequest } from './client';

export const authApi = {
  register(data: {
    email: string;
    fullName: string;
    password: string;
  }) {
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      json: data,
    });
  },
  login(data: { email: string; password: string }) {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      json: data,
    });
  },
  me() {
    return apiRequest<SafeUser>('/auth/me');
  },
};
