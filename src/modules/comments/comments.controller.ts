import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddCommentDto } from './add-comment.dto';
import { CommentsService } from './comments.service';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.interface';

@Controller()
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('comments')
  addComment(
    @Body() dto: AddCommentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.commentsService.addComment({
      content: dto.content,
      taskId: dto.taskId,
      authorId: user.id,
      actorId: user.id,
    });
  }

  @Get('tasks/:taskId/comments')
  findByTask(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.commentsService.findByTask(taskId, user);
  }
}
