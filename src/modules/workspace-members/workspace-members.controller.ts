import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { AddUserToWorkspaceDto } from './add-user-to-workspace.dto';
import { WorkspaceMembersService } from './workspace-members.service';

@Controller()
export class WorkspaceMembersController {
  constructor(
    private readonly workspaceMembersService: WorkspaceMembersService,
  ) {}

  @Post('workspaces/:workspaceId/members')
  addUserToWorkspace(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Body() dto: AddUserToWorkspaceDto,
  ) {
    return this.workspaceMembersService.addUserToWorkspace({
      workspaceId,
      userId: dto.userId,
    });
  }

  @Delete('workspaces/:workspaceId/members/:userId')
  removeUserFromWorkspace(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.workspaceMembersService.removeUserFromWorkspace({
      workspaceId,
      userId,
    });
  }

  @Get('workspaces/:workspaceId/members')
  findByWorkspace(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
  ) {
    return this.workspaceMembersService.findByWorkspace(workspaceId);
  }
}
