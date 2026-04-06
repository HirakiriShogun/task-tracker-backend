import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TaskType } from './task.type';
import { WorkspaceType } from './workspace.type';

@ObjectType('Project')
export class ProjectType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => ID)
  workspaceId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => WorkspaceType, { nullable: true })
  workspace?: WorkspaceType | null;

  @Field(() => [TaskType], { nullable: 'itemsAndList' })
  tasks?: TaskType[];
}
