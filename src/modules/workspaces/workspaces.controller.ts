import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWorkspaceDto } from './create-workspace.dto';
import { WorkspacesService } from './workspaces.service';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.interface';

@Controller()
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post('workspaces')
  create(
    @Body() dto: CreateWorkspaceDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.workspacesService.createWorkspace({
      name: dto.name,
      description: dto.description,
      creatorId: user.id,
    });
  }

  @Get('workspaces')
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.workspacesService.findAll(user);
  }

  @Get('workspaces/:id')
  findById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.workspacesService.findById(id, user);
  }
}
