import { ApiKeyGuard } from '@libs/guards/api-key.guard';
import { Controller, Post, Body, Logger, UseGuards } from '@nestjs/common';

import { SyncExternalUserCommand } from './sync-external-user.command';
import { SyncExternalUserService } from './sync-external-user.service';

@Controller('user')
@UseGuards(ApiKeyGuard)
export class SyncExternalUserHttpController {
  private readonly logger = new Logger(SyncExternalUserHttpController.name);

  constructor(private readonly syncExternalUserService: SyncExternalUserService) {}

  @Post('sync')
  async syncExternalUser(@Body() { externalAuthId }: { externalAuthId: string }) {
    const command = new SyncExternalUserCommand({
      externalAuthId,
    });

    await this.syncExternalUserService.execute(command);

    return { message: 'User sync completed' };
  }
}
