import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole, WorkspaceRole } from '@prisma/client';
import { AccessService } from '../auth/access.service';
import { AuthenticatedUser } from '../auth/types/authenticated-user.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspacesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accessService: AccessService,
  ) {}

  async createWorkspace(data: {
    name: string;
    description: string;
    creatorId: string;
  }) {
    const creator = await this.prisma.user.findUnique({
      where: { id: data.creatorId },
    });

    if (!creator) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.workspace.create({
      data: {
        name: data.name,
        description: data.description,
        members: {
          create: {
            userId: data.creatorId,
            role: WorkspaceRole.OWNER,
          },
        },
      },
    });
  }

  async findAll(actor?: AuthenticatedUser) {
    if (!actor || actor.role === UserRole.ADMIN) {
      return this.prisma.workspace.findMany();
    }

    return this.prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId: actor.id,
          },
        },
      },
    });
  }

  async findById(id: string, actor?: AuthenticatedUser) {
    if (actor) {
      await this.accessService.ensureWorkspaceMemberOrAdmin(actor.id, id);
    }

    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return workspace;
  }
}
