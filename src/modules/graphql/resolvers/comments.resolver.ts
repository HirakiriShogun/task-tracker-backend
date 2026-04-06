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
import { CommentsService } from '../../comments/comments.service';
import { TasksService } from '../../tasks/tasks.service';
import { UsersService } from '../../users/users.service';
import { AddCommentInput } from '../inputs/add-comment.input';
import { CommentType } from '../types/comment.type';
import { TaskType } from '../types/task.type';
import { UserType } from '../types/user.type';

@Resolver(() => CommentType)
export class CommentsResolver {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => [CommentType], { name: 'commentsByTask' })
  findByTask(
    @Args('taskId', { type: () => ID }, ParseUUIDPipe) taskId: string,
  ) {
    return this.commentsService.findByTask(taskId);
  }

  @Mutation(() => CommentType, { name: 'addComment' })
  addComment(@Args('input') input: AddCommentInput) {
    return this.commentsService.addComment(input);
  }

  @ResolveField(() => TaskType, { name: 'task' })
  task(@Parent() comment: CommentType) {
    if (comment.task) {
      return comment.task;
    }

    return this.tasksService.findById(comment.taskId);
  }

  @ResolveField(() => UserType, { name: 'author' })
  author(@Parent() comment: CommentType) {
    if (comment.author) {
      return comment.author;
    }

    return this.usersService.findById(comment.authorId);
  }
}
