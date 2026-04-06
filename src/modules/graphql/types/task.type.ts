import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TaskPriority, TaskStatus } from './graphql.enums';
import { CommentType } from './comment.type';
import { ProjectType } from './project.type';
import { UserType } from './user.type';

@ObjectType('Task')
export class TaskType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => TaskStatus)
  status: TaskStatus;

  @Field(() => TaskPriority)
  priority: TaskPriority;

  @Field(() => ID)
  projectId: string;

  @Field(() => ID)
  authorId: string;

  @Field(() => ID, { nullable: true })
  assigneeId?: string | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => ProjectType, { nullable: true })
  project?: ProjectType | null;

  @Field(() => [CommentType], { nullable: 'itemsAndList' })
  comments?: CommentType[];

  @Field(() => UserType, { nullable: true })
  author?: UserType | null;

  @Field(() => UserType, { nullable: true })
  assignee?: UserType | null;
}
