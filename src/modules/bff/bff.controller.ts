import {
  CacheInterceptor,
  CacheTTL,
} from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';
import { BFF_CACHE_TTL } from './bff.constants';
import { BffService } from './bff.service';

@Controller('bff')
@UseInterceptors(CacheInterceptor)
export class BffController {
  constructor(private readonly bffService: BffService) {}

  @Get('workspaces/:id/overview')
  @CacheTTL(BFF_CACHE_TTL)
  getWorkspaceOverview(@Param('id', ParseUUIDPipe) id: string) {
    return this.bffService.getWorkspaceOverview(id);
  }

  @Get('projects/:id/overview')
  @CacheTTL(BFF_CACHE_TTL)
  getProjectOverview(@Param('id', ParseUUIDPipe) id: string) {
    return this.bffService.getProjectOverview(id);
  }

  @Get('tasks/:id/details')
  @CacheTTL(BFF_CACHE_TTL)
  getTaskDetails(@Param('id', ParseUUIDPipe) id: string) {
    return this.bffService.getTaskDetails(id);
  }
}
