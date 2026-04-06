import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssignUserDto } from './assign-user.dto';
import { ChangeTaskStatusDto } from './change-task-status.dto';
import { CreateTaskDto } from './create-task.dto';
import { TasksService } from './tasks.service';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.interface';

@Controller()
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('tasks')
  create(
    @Body() dto: CreateTaskDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.tasksService.createTask({
      title: dto.title,
      description: dto.description,
      projectId: dto.projectId,
      authorId: user.id,
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
    });
  }

  @Patch('tasks/:id/assign')
  assignUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignUserDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.tasksService.assignUser({
      taskId: id,
      assigneeId: dto.assigneeId,
      actorId: user.id,
    });
  }

  @Patch('tasks/:id/status')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeTaskStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.tasksService.changeStatus({
      taskId: id,
      status: dto.status,
      actorId: user.id,
    });
  }

  @Get('tasks')
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.tasksService.findAll(user);
  }

  @Get('tasks/:id')
  findById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.tasksService.findById(id, user);
  }

  @Get('projects/:projectId/tasks')
  findByProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.tasksService.findByProject(projectId, user);
  }
}
