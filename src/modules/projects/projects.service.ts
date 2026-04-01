import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

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

    const member = await this.prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: data.userId,
          workspaceId: data.workspaceId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenException('User is not a workspace member');
    }

    return this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        workspaceId: data.workspaceId,
      },
    });
  }

  async findAll() {
    return this.prisma.project.findMany();
  }

  async findById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async findByWorkspace(workspaceId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return this.prisma.project.findMany({
      where: { workspaceId },
    });
  }
}
