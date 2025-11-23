import { Logger } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';

import { AttributePacksService } from './attribute-packs.service';

@Console()
export class AttibutePackCliController {
  private readonly logger = new Logger(AttibutePackCliController.name);

  constructor(private readonly attributePacksService: AttributePacksService) {}

  @Command({
    command: 'run:attribute-packs',
    description: 'Run packs attribution',
  })
  async attributePacks() {
    const startTime = Date.now();
    this.logger.log('Starting packs attribution...');

    await this.attributePacksService.attributePacks();

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    this.logger.log(`Packs attribution completed in ${duration}s`);
  }
}
