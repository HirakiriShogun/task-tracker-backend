import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ProjectType } from './project.type';
import { WorkspaceMemberType } from './workspace-member.type';

@ObjectType('Workspace')
export class WorkspaceType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [ProjectType], { nullable: 'itemsAndList' })
  projects?: ProjectType[];

  @Field(() => [WorkspaceMemberType], { nullable: 'itemsAndList' })
  members?: WorkspaceMemberType[];
}
