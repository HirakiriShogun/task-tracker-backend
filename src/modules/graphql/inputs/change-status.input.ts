import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsUUID } from 'class-validator';
import { TaskStatus } from '../types/graphql.enums';

@InputType()
export class ChangeStatusInput {
  @Field(() => ID)
  @IsUUID()
  taskId: string;

  @Field(() => TaskStatus)
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
