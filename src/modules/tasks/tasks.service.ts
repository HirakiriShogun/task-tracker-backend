import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskPriority, TaskStatus, UserRole } from '@prisma/client';
import { AccessService } from '../auth/access.service';
import { AuthenticatedUser } from '../auth/types/authenticated-user.interface';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accessService: AccessService,
  ) {}

  async createTask(data: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    projectId: string;
    authorId: string;
    assigneeId?: string;
  }) {
    if (!Object.values(TaskStatus).includes(data.status)) {
      throw new BadRequestException('Invalid task status');
    }

    if (!Object.values(TaskPriority).includes(data.priority)) {
      throw new BadRequestException('Invalid task priority');
    }

    const project = await this.prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const author = await this.prisma.user.findUnique({
      where: { id: data.authorId },
    });

    if (!author) {
      throw new NotFoundException('User not found');
    }

    await this.accessService.ensureWorkspaceMemberOrAdmin(
      data.authorId,
      project.workspaceId,
    );

    if (data.assigneeId) {
      const assignee = await this.prisma.user.findUnique({
        where: { id: data.assigneeId },
      });

      if (!assignee) {
        throw new NotFoundException('User not found');
      }

      await this.accessService.ensureWorkspaceMemberOrAdmin(
        data.assigneeId,
        project.workspaceId,
      );
    }

    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        projectId: data.projectId,
        authorId: data.authorId,
        assigneeId: data.assigneeId,
      },
    });
  }

  async assignUser(data: {
    taskId: string;
    assigneeId: string;
    actorId?: string;
  }) {
    if (data.actorId) {
      await this.accessService.ensureTaskOwnerOrAdmin(data.actorId, data.taskId);
    }

    const task = await this.prisma.task.findUnique({
      where: { id: data.taskId },
      select: {
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

    const assignee = await this.prisma.user.findUnique({
      where: { id: data.assigneeId },
    });

    if (!assignee) {
      throw new NotFoundException('User not found');
    }

    await this.accessService.ensureWorkspaceMemberOrAdmin(
      data.assigneeId,
      task.project.workspaceId,
    );

    return this.prisma.task.update({
      where: { id: data.taskId },
      data: { assigneeId: data.assigneeId },
    });
  }

  async changeStatus(data: {
    taskId: string;
    status: TaskStatus;
    actorId?: string;
  }) {
    if (!Object.values(TaskStatus).includes(data.status)) {
      throw new BadRequestException('Invalid task status');
    }

    if (data.actorId) {
      await this.accessService.ensureTaskMemberOrAdmin(data.actorId, data.taskId);
    }

    const task = await this.prisma.task.findUnique({
      where: { id: data.taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.task.update({
      where: { id: data.taskId },
      data: { status: data.status },
    });
  }

  async findAll(actor?: AuthenticatedUser) {
    if (!actor || actor.role === UserRole.ADMIN) {
      return this.prisma.task.findMany();
    }

    return this.prisma.task.findMany({
      where: {
        project: {
          workspace: {
            members: {
              some: {
                userId: actor.id,
              },
            },
          },
        },
      },
    });
  }

  async findById(id: string, actor?: AuthenticatedUser) {
    if (actor) {
      await this.accessService.ensureTaskMemberOrAdmin(actor.id, id);
    }

    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async findByProject(projectId: string, actor?: AuthenticatedUser) {
    if (actor) {
      await this.accessService.ensureProjectMemberOrAdmin(actor.id, projectId);
    } else {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }
    }

    return this.prisma.task.findMany({
      where: { projectId },
    });
  }
}
