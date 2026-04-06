import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WorkspaceRole } from '@prisma/client';
import { AccessService } from '../auth/access.service';
import { PrismaService } from '../prisma/prisma.service';
import { safeUserSelect } from '../users/safe-user.select';

@Injectable()
export class WorkspaceMembersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accessService: AccessService,
  ) {}

  async addUserToWorkspace(data: {
    userId: string;
    workspaceId: string;
    actorId?: string;
  }) {
    if (data.actorId) {
      await this.accessService.ensureWorkspaceOwnerOrAdmin(
        data.actorId,
        data.workspaceId,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const workspace = await this.prisma.workspace.findUnique({
      where: { id: data.workspaceId },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const existingMember = await this.prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: data.userId,
          workspaceId: data.workspaceId,
        },
      },
    });

    if (existingMember) {
      throw new BadRequestException('User is already a workspace member');
    }

    return this.prisma.workspaceMember.create({
      data: {
        userId: data.userId,
        workspaceId: data.workspaceId,
        role: WorkspaceRole.MEMBER,
      },
    });
  }

  async removeUserFromWorkspace(data: {
    userId: string;
    workspaceId: string;
    actorId?: string;
  }) {
    if (data.actorId) {
      await this.accessService.ensureWorkspaceOwnerOrAdmin(
        data.actorId,
        data.workspaceId,
      );
    }

    const member = await this.prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: data.userId,
          workspaceId: data.workspaceId,
        },
      },
    });

    if (!member) {
      throw new NotFoundException('User is not a workspace member');
    }

    return this.prisma.workspaceMember.delete({
      where: {
        userId_workspaceId: {
          userId: data.userId,
          workspaceId: data.workspaceId,
        },
      },
    });
  }

  async findByWorkspace(workspaceId: string, actorId?: string) {
    if (actorId) {
      await this.accessService.ensureWorkspaceMemberOrAdmin(actorId, workspaceId);
    } else {
      const workspace = await this.prisma.workspace.findUnique({
        where: { id: workspaceId },
      });

      if (!workspace) {
        throw new NotFoundException('Workspace not found');
      }
    }

    return this.prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: safeUserSelect,
        },
      },
    });
  }
}
