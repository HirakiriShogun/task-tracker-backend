import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { AccessService } from '../auth/access.service';
import { AuthenticatedUser } from '../auth/types/authenticated-user.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accessService: AccessService,
  ) {}

  async addComment(data: {
    content: string;
    taskId: string;
    authorId: string;
    actorId?: string;
  }) {
    if (data.actorId) {
      await this.accessService.ensureTaskMemberOrAdmin(data.actorId, data.taskId);
    }

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

    await this.accessService.ensureWorkspaceMemberOrAdmin(
      data.authorId,
      task.project.workspaceId,
    );

    return this.prisma.comment.create({
      data: {
        content: data.content,
        taskId: data.taskId,
        authorId: data.authorId,
      },
    });
  }

  async findByTask(taskId: string, actor?: AuthenticatedUser) {
    if (actor) {
      await this.accessService.ensureTaskMemberOrAdmin(actor.id, taskId);
    } else {
      const task = await this.prisma.task.findUnique({
        where: { id: taskId },
      });

      if (!task) {
        throw new NotFoundException('Task not found');
      }
    }

    return this.prisma.comment.findMany({
      where: { taskId },
    });
  }
}
