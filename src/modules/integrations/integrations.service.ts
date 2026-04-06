import { Injectable } from '@nestjs/common';
import { EXTERNAL_HEALTH_URL } from './integrations.constants';

@Injectable()
export class IntegrationsService {
  async getExternalHealth() {
    const startedAt = Date.now();
    const checkedAt = new Date().toISOString();

    try {
      const response = await fetch(EXTERNAL_HEALTH_URL, {
        headers: {
          'User-Agent': 'task-tracker-backend',
          Accept: 'application/vnd.github+json',
        },
      });

      await response.text();

      return {
        success: response.ok,
        statusCode: response.status,
        responseTimeMs: Date.now() - startedAt,
        checkedAt,
      };
    } catch {
      return {
        success: false,
        statusCode: null,
        responseTimeMs: Date.now() - startedAt,
        checkedAt,
      };
    }
  }
}
