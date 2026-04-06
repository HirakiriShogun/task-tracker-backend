import { Module } from '@nestjs/common';
import { BffModule } from './modules/bff/bff.module';
import { CommentsModule } from './modules/comments/comments.module';
import { TaskTrackerGraphqlModule } from './modules/graphql/graphql.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';
import { WorkspaceMembersModule } from './modules/workspace-members/workspace-members.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';

@Module({
  imports: [
    PrismaModule,
    BffModule,
    IntegrationsModule,
    UsersModule,
    WorkspacesModule,
    WorkspaceMembersModule,
    ProjectsModule,
    TasksModule,
    CommentsModule,
    TaskTrackerGraphqlModule,
  ],
})
export class AppModule {}
