import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class AssignUserInput {
  @Field(() => ID)
  @IsUUID()
  taskId: string;

  @Field(() => ID)
  @IsUUID()
  assigneeId: string;
}
