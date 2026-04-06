import { Prisma } from '@prisma/client';

export const safeUserSelect = {
  id: true,
  email: true,
  fullName: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;
