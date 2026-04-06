import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { AccessService } from '../auth/access.service';
import { AuthenticatedUser } from '../auth/types/authenticated-user.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accessService: AccessService,
  ) {}

  async createProject(data: {
    name: string;
    description: string;
    workspaceId: string;
    userId: string;
  }) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: data.workspaceId },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    await this.accessService.ensureWorkspaceOwnerOrAdmin(
      data.userId,
      data.workspaceId,
    );

    return this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        workspaceId: data.workspaceId,
      },
    });
  }

  async findAll(actor?: AuthenticatedUser) {
    if (!actor || actor.role === UserRole.ADMIN) {
      return this.prisma.project.findMany();
    }

    return this.prisma.project.findMany({
      where: {
        workspace: {
          members: {
            some: {
              userId: actor.id,
            },
          },
        },
      },
    });
  }

  async findById(id: string, actor?: AuthenticatedUser) {
    if (actor) {
      await this.accessService.ensureProjectMemberOrAdmin(actor.id, id);
    }

    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async findByWorkspace(workspaceId: string, actor?: AuthenticatedUser) {
    if (actor) {
      await this.accessService.ensureWorkspaceMemberOrAdmin(actor.id, workspaceId);
    } else {
      const workspace = await this.prisma.workspace.findUnique({
        where: { id: workspaceId },
      });

      if (!workspace) {
        throw new NotFoundException('Workspace not found');
      }
    }

    return this.prisma.project.findMany({
      where: { workspaceId },
    });
  }
}
