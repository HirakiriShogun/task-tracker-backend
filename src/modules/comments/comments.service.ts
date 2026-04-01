import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async addComment(data: { content: string; taskId: string; authorId: string }) {
    const task = await this.prisma.task.findUnique({
      where: { id: data.taskId },
      include: {
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

    const author = await this.prisma.user.findUnique({
      where: { id: data.authorId },
    });

    if (!author) {
      throw new NotFoundException('User not found');
    }

    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: data.authorId,
          workspaceId: task.project.workspaceId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('User is not a workspace member');
    }

    return this.prisma.comment.create({
      data: {
        content: data.content,
        taskId: data.taskId,
        authorId: data.authorId,
      },
    });
  }
}
