import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class AddUserToWorkspaceInput {
  @Field(() => ID)
  @IsUUID()
  workspaceId: string;

  @Field(() => ID)
  @IsUUID()
  userId: string;
}
