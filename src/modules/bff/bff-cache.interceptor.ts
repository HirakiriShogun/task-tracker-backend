import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class BffCacheInterceptor extends CacheInterceptor {
  protected trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();

    if (!request) {
      return undefined;
    }

    const userId = request.user?.id ?? 'anonymous';
    const url = request.originalUrl ?? request.url;

    if (!url) {
      return undefined;
    }

    return `${userId}:${url}`;
  }
}
