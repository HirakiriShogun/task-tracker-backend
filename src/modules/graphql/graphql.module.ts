import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { CommentsModule } from '../comments/comments.module';
import { ProjectsModule } from '../projects/projects.module';
import { TasksModule } from '../tasks/tasks.module';
import { UsersModule } from '../users/users.module';
import { WorkspaceMembersModule } from '../workspace-members/workspace-members.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { CommentsResolver } from './resolvers/comments.resolver';
import { ProjectsResolver } from './resolvers/projects.resolver';
import { TasksResolver } from './resolvers/tasks.resolver';
import { UsersResolver } from './resolvers/users.resolver';
import { WorkspaceMembersResolver } from './resolvers/workspace-members.resolver';
import { WorkspacesResolver } from './resolvers/workspaces.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      introspection: true,
    }),
    UsersModule,
    WorkspacesModule,
    WorkspaceMembersModule,
    ProjectsModule,
    TasksModule,
    CommentsModule,
  ],
  providers: [
    UsersResolver,
    WorkspacesResolver,
    WorkspaceMembersResolver,
    ProjectsResolver,
    TasksResolver,
    CommentsResolver,
  ],
})
export class TaskTrackerGraphqlModule {}
