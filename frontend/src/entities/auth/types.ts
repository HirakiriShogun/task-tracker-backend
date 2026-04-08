export type UserRole = 'ADMIN' | 'USER';

export type SafeUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  accessToken: string;
  user: SafeUser;
};
