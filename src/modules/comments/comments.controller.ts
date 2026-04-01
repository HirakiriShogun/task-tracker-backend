import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { AddCommentDto } from './add-comment.dto';
import { CommentsService } from './comments.service';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('comments')
  addComment(@Body() dto: AddCommentDto) {
    return this.commentsService.addComment(dto);
  }

  @Get('tasks/:taskId/comments')
  findByTask(@Param('taskId', ParseUUIDPipe) taskId: string) {
    return this.commentsService.findByTask(taskId);
  }
}
