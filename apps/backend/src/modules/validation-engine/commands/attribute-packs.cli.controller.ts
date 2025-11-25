import { FeatureFlagProvider } from '@libs/database/helpers/feature-flag.provider';
import { MAINTENANCE_MODE_KEY } from '@libs/guards/maintenance-mode.guard';
import { BadRequestException, Logger } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';

import { AttributePacksService } from './attribute-packs.service';

@Console()
export class AttibutePackCliController {
  private readonly logger = new Logger(AttibutePackCliController.name);

  constructor(
    private readonly attributePacksService: AttributePacksService,
    private readonly featureFlagProvider: FeatureFlagProvider,
  ) {}

  @Command({
    command: 'run:attribute-packs',
    description: 'Run packs attribution',
  })
  async attributePacks() {
    // Check if maintenance mode is already on
    const isMaintenanceMode = await this.featureFlagProvider.isFlagActive(MAINTENANCE_MODE_KEY);
    if (isMaintenanceMode) {
      throw new BadRequestException('Maintenance mode is already active. Cannot run attribution.');
    }

    try {
      // Set maintenance mode to on
      await this.featureFlagProvider.setFlagState(MAINTENANCE_MODE_KEY, true);
      this.logger.log('🔒 Maintenance mode activated');

      const startTime = Date.now();
      this.logger.log('Starting packs attribution:');

      await this.attributePacksService.attributePacks();

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      this.logger.log(`Completed packs attribution in ${duration}s`);
    } finally {
      // Always set maintenance mode to off when done
      await this.featureFlagProvider.setFlagState(MAINTENANCE_MODE_KEY, false);
      this.logger.log('🔓 Maintenance mode deactivated');
    }
  }
}
