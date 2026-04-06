import { Field, InputType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateWorkspaceInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => ID)
  @IsUUID()
  creatorId: string;
}
