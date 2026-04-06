import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { AuthenticatedUser } from '../auth/types/authenticated-user.interface';
import { PrismaService } from '../prisma/prisma.service';
import { safeUserSelect } from './safe-user.select';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    email: string;
    fullName: string;
    password?: string;
    passwordHash?: string;
    role?: UserRole;
  }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const passwordHash =
      data.passwordHash ??
      (await bcrypt.hash(data.password ?? randomUUID(), 10));

    return this.prisma.user.create({
      data: {
        email: data.email,
        fullName: data.fullName,
        passwordHash,
        role: data.role ?? UserRole.USER,
      },
      select: safeUserSelect,
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: safeUserSelect,
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: safeUserSelect,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByIdForActor(id: string, actor: AuthenticatedUser) {
    if (actor.role !== UserRole.ADMIN && actor.id !== id) {
      throw new ForbiddenException('Access denied');
    }

    return this.findById(id);
  }

  findByEmailForAuth(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  toSafeUser(user: {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
