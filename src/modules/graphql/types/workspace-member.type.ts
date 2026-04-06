import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserType } from './user.type';
import { WorkspaceType } from './workspace.type';

@ObjectType('WorkspaceMember')
export class WorkspaceMemberType {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  workspaceId: string;

  @Field()
  joinedAt: Date;

  @Field(() => UserType, { nullable: true })
  user?: UserType | null;

  @Field(() => WorkspaceType, { nullable: true })
  workspace?: WorkspaceType | null;
}
