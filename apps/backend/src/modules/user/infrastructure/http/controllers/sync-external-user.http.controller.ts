import { Email } from '@libs/ddd';
import { ApiKeyGuard } from '@libs/guards/api-key.guard';
import { SyncExternalUserCommand } from '@modules/user/application/commands/sync-external-user/sync-external-user.command';
import { SyncExternalUserService } from '@modules/user/application/commands/sync-external-user/sync-external-user.service';
import { Controller, Post, Body, Logger, UseGuards } from '@nestjs/common';

@Controller('user/sync')
@UseGuards(ApiKeyGuard)
export class SyncExternalUserHttpController {
  private readonly logger = new Logger(SyncExternalUserHttpController.name);

  constructor(private readonly syncExternalUserService: SyncExternalUserService) {}

  @Post()
  async syncExternalUser(
    @Body() { externalAuthId, email }: { externalAuthId: string; email: string },
  ) {
    const command = new SyncExternalUserCommand({
      externalAuthId,
      email: new Email({ email }),
      metadata: { userId: 'auth0-webhook' },
    });

    await this.syncExternalUserService.execute(command);

    return { message: 'User sync completed' };
  }
}
