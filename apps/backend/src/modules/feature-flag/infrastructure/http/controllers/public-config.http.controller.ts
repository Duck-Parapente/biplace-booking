import { FeatureFlagProvider } from '@libs/database/helpers/feature-flag.provider';
import { MAINTENANCE_MODE_KEY } from '@libs/guards/maintenance-mode.guard';
import { Controller, Logger, Get } from '@nestjs/common';
import { PublicConfigDto } from 'shared';

@Controller('public-config')
export class PublicConfigHttpController {
  private readonly logger = new Logger(PublicConfigHttpController.name);

  constructor(private readonly featureFlagProvider: FeatureFlagProvider) {}

  @Get()
  async getPublicConfig(): Promise<PublicConfigDto> {
    const isActive = await this.featureFlagProvider.isFlagActive(MAINTENANCE_MODE_KEY);
    return {
      maintenanceMode: isActive,
    };
  }
}
