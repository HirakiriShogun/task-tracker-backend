import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole, WorkspaceRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccessService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async ensureWorkspaceMemberOrAdmin(userId: string, workspaceId: string) {
    const user = await this.getUser(userId);

    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        id: true,
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    if (user.role === UserRole.ADMIN) {
      return {
        workspaceId,
        role: WorkspaceRole.OWNER,
      };
    }

    const member = await this.prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
      select: {
        workspaceId: true,
        role: true,
      },
    });

    if (!member) {
      throw new ForbiddenException('User is not a workspace member');
    }

    return member;
  }

  async ensureWorkspaceOwnerOrAdmin(userId: string, workspaceId: string) {
    const member = await this.ensureWorkspaceMemberOrAdmin(userId, workspaceId);

    if (member.role !== WorkspaceRole.OWNER) {
      throw new ForbiddenException('User does not have access to manage workspace');
    }
  }

  async ensureProjectMemberOrAdmin(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        workspaceId: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.ensureWorkspaceMemberOrAdmin(userId, project.workspaceId);

    return project;
  }

  async ensureProjectOwnerOrAdmin(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        workspaceId: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.ensureWorkspaceOwnerOrAdmin(userId, project.workspaceId);

    return project;
  }

  async ensureTaskMemberOrAdmin(userId: string, taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        project: {
          select: {
            workspaceId: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.ensureWorkspaceMemberOrAdmin(userId, task.project.workspaceId);

    return task;
  }

  async ensureTaskOwnerOrAdmin(userId: string, taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        project: {
          select: {
            workspaceId: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.ensureWorkspaceOwnerOrAdmin(userId, task.project.workspaceId);

    return task;
  }
}
