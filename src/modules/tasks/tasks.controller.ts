import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { AssignUserDto } from './assign-user.dto';
import { ChangeTaskStatusDto } from './change-task-status.dto';
import { CreateTaskDto } from './create-task.dto';
import { TasksService } from './tasks.service';

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('tasks')
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.createTask({
      title: dto.title,
      description: dto.description,
      projectId: dto.projectId,
      authorId: dto.authorId,
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
    });
  }

  @Patch('tasks/:id/assign')
  assignUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignUserDto,
  ) {
    return this.tasksService.assignUser({
      taskId: id,
      assigneeId: dto.assigneeId,
    });
  }

  @Patch('tasks/:id/status')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeTaskStatusDto,
  ) {
    return this.tasksService.changeStatus({
      taskId: id,
      status: dto.status,
    });
  }

  @Get('tasks')
  findAll() {
    return this.tasksService.findAll();
  }

  @Get('tasks/:id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findById(id);
  }

  @Get('projects/:projectId/tasks')
  findByProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.tasksService.findByProject(projectId);
  }
}
