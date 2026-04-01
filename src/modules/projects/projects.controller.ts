import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CreateProjectDto } from './create-project.dto';
import { ProjectsService } from './projects.service';

@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('projects')
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.createProject({
      name: dto.name,
      description: dto.description,
      workspaceId: dto.workspaceId,
      userId: dto.creatorId,
    });
  }

  @Get('projects')
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('projects/:id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findById(id);
  }

  @Get('workspaces/:workspaceId/projects')
  findByWorkspace(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
  ) {
    return this.projectsService.findByWorkspace(workspaceId);
  }
}
