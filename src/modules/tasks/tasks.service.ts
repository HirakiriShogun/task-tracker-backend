import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskPriority, TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

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

    const authorMembership = await this.prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: data.authorId,
          workspaceId: project.workspaceId,
        },
      },
    });

    if (!authorMembership) {
      throw new ForbiddenException('User is not a workspace member');
    }

    if (data.assigneeId) {
      const assignee = await this.prisma.user.findUnique({
        where: { id: data.assigneeId },
      });

      if (!assignee) {
        throw new NotFoundException('User not found');
      }

      const assigneeMembership = await this.prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: data.assigneeId,
            workspaceId: project.workspaceId,
          },
        },
      });

      if (!assigneeMembership) {
        throw new ForbiddenException('User is not a workspace member');
      }
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

  async assignUser(data: { taskId: string; assigneeId: string }) {
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

    const assignee = await this.prisma.user.findUnique({
      where: { id: data.assigneeId },
    });

    if (!assignee) {
      throw new NotFoundException('User not found');
    }

    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: data.assigneeId,
          workspaceId: task.project.workspaceId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('User is not a workspace member');
    }

    return this.prisma.task.update({
      where: { id: data.taskId },
      data: { assigneeId: data.assigneeId },
    });
  }

  async changeStatus(data: { taskId: string; status: TaskStatus }) {
    if (!Object.values(TaskStatus).includes(data.status)) {
      throw new BadRequestException('Invalid task status');
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

  async findAll() {
    return this.prisma.task.findMany();
  }

  async findById(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async findByProject(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.task.findMany({
      where: { projectId },
    });
  }
}
