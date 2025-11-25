import { FeatureFlagProvider } from '@libs/database/helpers/feature-flag.provider';
import { Controller, Logger, Get } from '@nestjs/common';
import { PublicConfigDto } from 'shared';

@Controller('public-config')
export class PublicConfigHttpController {
  private readonly logger = new Logger(PublicConfigHttpController.name);

  constructor(private readonly featureFlagProvider: FeatureFlagProvider) {}

  @Get()
  async getPublicConfig(): Promise<PublicConfigDto> {
    const isActive = await this.featureFlagProvider.isFlagActive('maintenance_mode'); // use key from future guard lib file
    return {
      maintenanceMode: isActive,
    };
  }
}
