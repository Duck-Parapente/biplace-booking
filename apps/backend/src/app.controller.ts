import { Controller, Get } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  @Get('health')
  health() {
    this.logger.log('Health check requested');
    throw new Error('Health check failed');
  }
}
