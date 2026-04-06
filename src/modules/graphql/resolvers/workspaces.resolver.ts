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
import { WorkspaceMembersService } from '../../workspace-members/workspace-members.service';
import { WorkspacesService } from '../../workspaces/workspaces.service';
import { CreateWorkspaceInput } from '../inputs/create-workspace.input';
import { ProjectType } from '../types/project.type';
import { WorkspaceMemberType } from '../types/workspace-member.type';
import { WorkspaceType } from '../types/workspace.type';

@Resolver(() => WorkspaceType)
export class WorkspacesResolver {
  constructor(
    private readonly workspacesService: WorkspacesService,
    private readonly projectsService: ProjectsService,
    private readonly workspaceMembersService: WorkspaceMembersService,
  ) {}

  @Query(() => [WorkspaceType], { name: 'workspaces' })
  findAll() {
    return this.workspacesService.findAll();
  }

  @Query(() => WorkspaceType, { name: 'workspace' })
  findById(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.workspacesService.findById(id);
  }

  @Mutation(() => WorkspaceType, { name: 'createWorkspace' })
  createWorkspace(@Args('input') input: CreateWorkspaceInput) {
    return this.workspacesService.createWorkspace(input);
  }

  @ResolveField(() => [ProjectType], { name: 'projects' })
  projects(@Parent() workspace: WorkspaceType) {
    return this.projectsService.findByWorkspace(workspace.id);
  }

  @ResolveField(() => [WorkspaceMemberType], { name: 'members' })
  members(@Parent() workspace: WorkspaceType) {
    return this.workspaceMembersService.findByWorkspace(workspace.id);
  }
}
