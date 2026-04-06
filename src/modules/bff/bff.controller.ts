import {
  CacheTTL,
} from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BFF_CACHE_TTL } from './bff.constants';
import { BffCacheInterceptor } from './bff-cache.interceptor';
import { BffService } from './bff.service';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.interface';

@Controller('bff')
@UseGuards(JwtAuthGuard)
@UseInterceptors(BffCacheInterceptor)
export class BffController {
  constructor(private readonly bffService: BffService) {}

  @Get('workspaces/:id/overview')
  @CacheTTL(BFF_CACHE_TTL)
  getWorkspaceOverview(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.bffService.getWorkspaceOverview(id, user.id);
  }

  @Get('projects/:id/overview')
  @CacheTTL(BFF_CACHE_TTL)
  getProjectOverview(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.bffService.getProjectOverview(id, user.id);
  }

  @Get('tasks/:id/details')
  @CacheTTL(BFF_CACHE_TTL)
  getTaskDetails(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.bffService.getTaskDetails(id, user.id);
  }
}
