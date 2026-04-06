import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { CommentsService } from '../../comments/comments.service';
import { ProjectsService } from '../../projects/projects.service';
import { TasksService } from '../../tasks/tasks.service';
import { UsersService } from '../../users/users.service';
import { AssignUserInput } from '../inputs/assign-user.input';
import { ChangeStatusInput } from '../inputs/change-status.input';
import { CreateTaskInput } from '../inputs/create-task.input';
import { CommentType } from '../types/comment.type';
import { ProjectType } from '../types/project.type';
import { TaskType } from '../types/task.type';
import { UserType } from '../types/user.type';

@Resolver(() => TaskType)
export class TasksResolver {
  constructor(
    private readonly tasksService: TasksService,
    private readonly projectsService: ProjectsService,
    private readonly commentsService: CommentsService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => [TaskType], { name: 'tasks' })
  findAll() {
    return this.tasksService.findAll();
  }

  @Query(() => TaskType, { name: 'task' })
  findById(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.tasksService.findById(id);
  }

  @Query(() => [TaskType], { name: 'tasksByProject' })
  findByProject(
    @Args('projectId', { type: () => ID }, ParseUUIDPipe) projectId: string,
  ) {
    return this.tasksService.findByProject(projectId);
  }

  @Mutation(() => TaskType, { name: 'createTask' })
  createTask(@Args('input') input: CreateTaskInput) {
    return this.tasksService.createTask({
      title: input.title,
      description: input.description,
      projectId: input.projectId,
      authorId: input.authorId,
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
    });
  }

  @Mutation(() => TaskType, { name: 'assignUser' })
  assignUser(@Args('input') input: AssignUserInput) {
    return this.tasksService.assignUser(input);
  }

  @Mutation(() => TaskType, { name: 'changeStatus' })
  changeStatus(@Args('input') input: ChangeStatusInput) {
    return this.tasksService.changeStatus(input);
  }

  @ResolveField(() => ProjectType, { name: 'project' })
  project(@Parent() task: TaskType) {
    if (task.project) {
      return task.project;
    }

    return this.projectsService.findById(task.projectId);
  }

  @ResolveField(() => [CommentType], { name: 'comments' })
  comments(@Parent() task: TaskType) {
    return this.commentsService.findByTask(task.id);
  }

  @ResolveField(() => UserType, { name: 'author' })
  author(@Parent() task: TaskType) {
    if (task.author) {
      return task.author;
    }

    return this.usersService.findById(task.authorId);
  }

  @ResolveField(() => UserType, { name: 'assignee', nullable: true })
  assignee(@Parent() task: TaskType) {
    if (task.assignee) {
      return task.assignee;
    }

    if (!task.assigneeId) {
      return null;
    }

    return this.usersService.findById(task.assigneeId);
  }
}
