import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { AccessService } from '../auth/access.service';
import { PrismaService } from '../prisma/prisma.service';
import { safeUserSelect } from '../users/safe-user.select';

type StatusCounts = {
  TODO: number;
  IN_PROGRESS: number;
  DONE: number;
};

type PriorityCounts = {
  LOW: number;
  MEDIUM: number;
  HIGH: number;
};

@Injectable()
export class BffService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accessService: AccessService,
  ) {}

  async getWorkspaceOverview(id: string, actorId: string) {
    await this.accessService.ensureWorkspaceMemberOrAdmin(actorId, id);

    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: safeUserSelect,
            },
          },
          orderBy: {
            joinedAt: 'asc',
          },
        },
        projects: {
          include: {
            tasks: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const tasks = workspace.projects.flatMap((project) => project.tasks);
    const tasksByStatus = this.countTasksByStatus(tasks);

    return {
      workspace: {
        id: workspace.id,
        name: workspace.name,
        description: workspace.description,
        createdAt: workspace.createdAt,
        updatedAt: workspace.updatedAt,
      },
      members: workspace.members.map((member) => ({
        id: member.id,
        userId: member.userId,
        workspaceId: member.workspaceId,
        joinedAt: member.joinedAt,
        user: {
          id: member.user.id,
          email: member.user.email,
          fullName: member.user.fullName,
        },
      })),
      projects: workspace.projects.map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        workspaceId: project.workspaceId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        taskCount: project.tasks.length,
      })),
      counts: {
        projects: workspace.projects.length,
        tasks: tasks.length,
        tasksByStatus,
      },
    };
  }

  async getProjectOverview(id: string, actorId: string) {
    await this.accessService.ensureProjectMemberOrAdmin(actorId, id);

    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        workspace: true,
        tasks: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const tasksByStatus = this.countTasksByStatus(project.tasks);
    const tasksByPriority = this.countTasksByPriority(project.tasks);

    return {
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        workspaceId: project.workspaceId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
      workspace: {
        id: project.workspace.id,
        name: project.workspace.name,
        description: project.workspace.description,
        createdAt: project.workspace.createdAt,
        updatedAt: project.workspace.updatedAt,
      },
      tasks: project.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        projectId: task.projectId,
        authorId: task.authorId,
        assigneeId: task.assigneeId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })),
      counts: {
        tasks: project.tasks.length,
        tasksByStatus,
        tasksByPriority,
      },
    };
  }

  async getTaskDetails(id: string, actorId: string) {
    await this.accessService.ensureTaskMemberOrAdmin(actorId, id);

    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        author: {
          select: safeUserSelect,
        },
        assignee: {
          select: safeUserSelect,
        },
        project: {
          include: {
            workspace: true,
          },
        },
        comments: {
          include: {
            author: {
              select: safeUserSelect,
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return {
      task: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        projectId: task.projectId,
        authorId: task.authorId,
        assigneeId: task.assigneeId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
      author: {
        id: task.author.id,
        email: task.author.email,
        fullName: task.author.fullName,
      },
      assignee: task.assignee
        ? {
            id: task.assignee.id,
            email: task.assignee.email,
            fullName: task.assignee.fullName,
          }
        : null,
      project: {
        id: task.project.id,
        name: task.project.name,
        description: task.project.description,
        workspaceId: task.project.workspaceId,
        createdAt: task.project.createdAt,
        updatedAt: task.project.updatedAt,
      },
      workspace: {
        id: task.project.workspace.id,
        name: task.project.workspace.name,
        description: task.project.workspace.description,
        createdAt: task.project.workspace.createdAt,
        updatedAt: task.project.workspace.updatedAt,
      },
      comments: task.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        taskId: comment.taskId,
        authorId: comment.authorId,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        author: {
          id: comment.author.id,
          email: comment.author.email,
          fullName: comment.author.fullName,
        },
      })),
    };
  }

  private countTasksByStatus(
    tasks: Array<{
      status: TaskStatus;
    }>,
  ): StatusCounts {
    return tasks.reduce<StatusCounts>(
      (counts, task) => {
        counts[task.status] += 1;
        return counts;
      },
      {
        TODO: 0,
        IN_PROGRESS: 0,
        DONE: 0,
      },
    );
  }

  private countTasksByPriority(
    tasks: Array<{
      priority: TaskPriority;
    }>,
  ): PriorityCounts {
    return tasks.reduce<PriorityCounts>(
      (counts, task) => {
        counts[task.priority] += 1;
        return counts;
      },
      {
        LOW: 0,
        MEDIUM: 0,
        HIGH: 0,
      },
    );
  }
}
