import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CreateWorkspaceDto } from './create-workspace.dto';
import { WorkspacesService } from './workspaces.service';

@Controller()
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post('workspaces')
  create(@Body() dto: CreateWorkspaceDto) {
    return this.workspacesService.createWorkspace(dto);
  }

  @Get('workspaces')
  findAll() {
    return this.workspacesService.findAll();
  }

  @Get('workspaces/:id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.workspacesService.findById(id);
  }
}
