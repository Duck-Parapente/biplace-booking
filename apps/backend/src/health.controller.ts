import { Controller, Get } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Controller()
export class HealthController {
  private readonly logger = new Logger(HealthController.name);
  @Get('health')
  health() {
    this.logger.warn('Health check requested');
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
