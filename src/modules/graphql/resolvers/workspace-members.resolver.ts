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
import { UsersService } from '../../users/users.service';
import { WorkspaceMembersService } from '../../workspace-members/workspace-members.service';
import { WorkspacesService } from '../../workspaces/workspaces.service';
import { AddUserToWorkspaceInput } from '../inputs/add-user-to-workspace.input';
import { RemoveUserFromWorkspaceInput } from '../inputs/remove-user-from-workspace.input';
import { UserType } from '../types/user.type';
import { WorkspaceMemberType } from '../types/workspace-member.type';
import { WorkspaceType } from '../types/workspace.type';

@Resolver(() => WorkspaceMemberType)
export class WorkspaceMembersResolver {
  constructor(
    private readonly workspaceMembersService: WorkspaceMembersService,
    private readonly usersService: UsersService,
    private readonly workspacesService: WorkspacesService,
  ) {}

  @Query(() => [WorkspaceMemberType], { name: 'workspaceMembers' })
  findByWorkspace(
    @Args('workspaceId', { type: () => ID }, ParseUUIDPipe) workspaceId: string,
  ) {
    return this.workspaceMembersService.findByWorkspace(workspaceId);
  }

  @Mutation(() => WorkspaceMemberType, { name: 'addUserToWorkspace' })
  addUserToWorkspace(@Args('input') input: AddUserToWorkspaceInput) {
    return this.workspaceMembersService.addUserToWorkspace(input);
  }

  @Mutation(() => WorkspaceMemberType, { name: 'removeUserFromWorkspace' })
  removeUserFromWorkspace(@Args('input') input: RemoveUserFromWorkspaceInput) {
    return this.workspaceMembersService.removeUserFromWorkspace(input);
  }

  @ResolveField(() => UserType, { name: 'user' })
  user(@Parent() member: WorkspaceMemberType) {
    if (member.user) {
      return member.user;
    }

    return this.usersService.findById(member.userId);
  }

  @ResolveField(() => WorkspaceType, { name: 'workspace' })
  workspace(@Parent() member: WorkspaceMemberType) {
    if (member.workspace) {
      return member.workspace;
    }

    return this.workspacesService.findById(member.workspaceId);
  }
}
