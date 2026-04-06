import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BffController } from './bff.controller';
import { BffCacheInterceptor } from './bff-cache.interceptor';
import { BffService } from './bff.service';

@Module({
  imports: [CacheModule.register(), AuthModule],
  controllers: [BffController],
  providers: [BffService, BffCacheInterceptor],
})
export class BffModule {}
