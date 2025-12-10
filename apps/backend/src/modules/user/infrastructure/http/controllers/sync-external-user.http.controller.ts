import { Email } from '@libs/ddd';
import { UUID } from '@libs/ddd/uuid.value-object';
import { ApiKeyGuard } from '@libs/guards/api-key.guard';
import { SyncExternalUserCommand } from '@modules/user/application/commands/sync-external-user/sync-external-user.command';
import { SyncExternalUserService } from '@modules/user/application/commands/sync-external-user/sync-external-user.service';
import { Controller, Post, Body, Logger, UseGuards } from '@nestjs/common';

const AUTH0_FAKE_USER_ID = 'a0000000-0000-0000-0000-000000000000';

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
      metadata: { userId: new UUID({ uuid: AUTH0_FAKE_USER_ID }) },
    });

    await this.syncExternalUserService.execute(command);

    return { message: 'User sync completed' };
  }
}
