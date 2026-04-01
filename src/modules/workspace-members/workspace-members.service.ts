import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspaceMembersService {
  constructor(private readonly prisma: PrismaService) {}

  async addUserToWorkspace(data: { userId: string; workspaceId: string }) {
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
      },
    });
  }

  async removeUserFromWorkspace(data: { userId: string; workspaceId: string }) {
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

  async findByWorkspace(workspaceId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return this.prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: true,
      },
    });
  }
}
