import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

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
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.workspace.findMany();
  }

  async findById(id: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return workspace;
  }
}
