import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class AddCommentInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  content: string;

  @Field(() => ID)
  @IsUUID()
  taskId: string;

  @Field(() => ID)
  @IsUUID()
  authorId: string;
}
