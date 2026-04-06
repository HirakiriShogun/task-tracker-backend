import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TaskType } from './task.type';
import { UserType } from './user.type';

@ObjectType('Comment')
export class CommentType {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field(() => ID)
  taskId: string;

  @Field(() => ID)
  authorId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => TaskType, { nullable: true })
  task?: TaskType | null;

  @Field(() => UserType, { nullable: true })
  author?: UserType | null;
}
