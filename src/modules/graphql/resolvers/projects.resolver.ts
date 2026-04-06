import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { ProjectsService } from '../../projects/projects.service';
import { TasksService } from '../../tasks/tasks.service';
import { WorkspacesService } from '../../workspaces/workspaces.service';
import { CreateProjectInput } from '../inputs/create-project.input';
import { ProjectType } from '../types/project.type';
import { TaskType } from '../types/task.type';
import { WorkspaceType } from '../types/workspace.type';

@Resolver(() => ProjectType)
export class ProjectsResolver {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService,
    private readonly workspacesService: WorkspacesService,
  ) {}

  @Query(() => [ProjectType], { name: 'projects' })
  findAll() {
    return this.projectsService.findAll();
  }

  @Query(() => ProjectType, { name: 'project' })
  findById(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.projectsService.findById(id);
  }

  @Query(() => [ProjectType], { name: 'projectsByWorkspace' })
  findByWorkspace(
    @Args('workspaceId', { type: () => ID }, ParseUUIDPipe) workspaceId: string,
  ) {
    return this.projectsService.findByWorkspace(workspaceId);
  }

  @Mutation(() => ProjectType, { name: 'createProject' })
  createProject(@Args('input') input: CreateProjectInput) {
    return this.projectsService.createProject({
      name: input.name,
      description: input.description,
      workspaceId: input.workspaceId,
      userId: input.creatorId,
    });
  }

  @ResolveField(() => WorkspaceType, { name: 'workspace' })
  workspace(@Parent() project: ProjectType) {
    if (project.workspace) {
      return project.workspace;
    }

    return this.workspacesService.findById(project.workspaceId);
  }

  @ResolveField(() => [TaskType], { name: 'tasks' })
  tasks(@Parent() project: ProjectType) {
    return this.tasksService.findByProject(project.id);
  }
}
