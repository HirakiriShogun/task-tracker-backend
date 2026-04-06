import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddUserToWorkspaceDto } from './add-user-to-workspace.dto';
import { WorkspaceMembersService } from './workspace-members.service';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.interface';

@Controller()
@UseGuards(JwtAuthGuard)
export class WorkspaceMembersController {
  constructor(
    private readonly workspaceMembersService: WorkspaceMembersService,
  ) {}

  @Post('workspaces/:workspaceId/members')
  addUserToWorkspace(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Body() dto: AddUserToWorkspaceDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.workspaceMembersService.addUserToWorkspace({
      workspaceId,
      userId: dto.userId,
      actorId: user.id,
    });
  }

  @Delete('workspaces/:workspaceId/members/:userId')
  removeUserFromWorkspace(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.workspaceMembersService.removeUserFromWorkspace({
      workspaceId,
      userId,
      actorId: user.id,
    });
  }

  @Get('workspaces/:workspaceId/members')
  findByWorkspace(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.workspaceMembersService.findByWorkspace(workspaceId, user.id);
  }
}
