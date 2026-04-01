import { Module } from '@nestjs/common';
import { CommentsModule } from './modules/comments/comments.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    WorkspacesModule,
    ProjectsModule,
    TasksModule,
    CommentsModule,
  ],
})
export class AppModule {}
