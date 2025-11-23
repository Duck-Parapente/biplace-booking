import { Logger } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';

@Console()
export class AttibutePackCliController {
  private readonly logger = new Logger(AttibutePackCliController.name);

  @Command({
    command: 'run:attribute-packs',
    description: 'Run packs attribution',
  })
  async attributePacks() {
    this.logger.log('Attribute packs command executed');
  }
}
