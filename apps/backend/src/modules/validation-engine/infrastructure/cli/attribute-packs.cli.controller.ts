import { FeatureFlagProvider } from '@libs/database/helpers/feature-flag.provider';
import { MAINTENANCE_MODE_KEY } from '@libs/guards/maintenance-mode.guard';
import { AttributePacksService } from '@modules/validation-engine/application/commands/attribute-packs/attribute-packs.service';
import { NotificationPort } from '@modules/validation-engine/domain/ports/notification.port';
import { NOTIFICATION_PORT } from '@modules/validation-engine/validation-engine.di-tokens';
import { BadRequestException, Inject, Logger } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';

const COMMAND_NAME = 'run:attribute-packs';
@Console()
export class AttibutePackCliController {
  private readonly logger = new Logger(AttibutePackCliController.name);

  constructor(
    private readonly attributePacksService: AttributePacksService,
    private readonly featureFlagProvider: FeatureFlagProvider,
    @Inject(NOTIFICATION_PORT) private readonly notificationPort: NotificationPort,
  ) {}

  @Command({
    command: COMMAND_NAME,
    description: 'Run packs attribution',
  })
  async attributePacks() {
    const isMaintenanceMode = await this.featureFlagProvider.isFlagActive(MAINTENANCE_MODE_KEY);
    if (isMaintenanceMode) {
      throw new BadRequestException('Maintenance mode is already active. Cannot run attribution.');
    }

    try {
      await this.featureFlagProvider.setFlagState(MAINTENANCE_MODE_KEY, true);
      this.logger.log('🔒 Maintenance mode activated');

      const startTime = Date.now();
      this.logger.log('Starting packs attribution:');

      await this.attributePacksService.attributePacks();

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      this.logger.log(`Completed packs attribution in ${duration}s`);
    } catch (error) {
      this.logger.error('Error during packs attribution', (error as Error).stack);

      await this.notificationPort.reportTechnicalError(error as Error, {
        command: COMMAND_NAME,
        timestamp: new Date().toISOString(),
      });

      throw error;
    } finally {
      await this.featureFlagProvider.setFlagState(MAINTENANCE_MODE_KEY, false);
      this.logger.log('🔓 Maintenance mode deactivated');
    }
  }
}
