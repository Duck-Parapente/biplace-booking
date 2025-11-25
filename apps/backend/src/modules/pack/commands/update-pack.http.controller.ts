import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { Roles } from '@libs/guards/roles.decorator';
import { RolesGuard } from '@libs/guards/roles.guard';
import { Controller, Patch, Body, Logger, UseGuards, Param, Request } from '@nestjs/common';
import { UpdatePackDto, UserRoles } from 'shared';

import { UpdatePackCommand } from './update-pack.command';
import { UpdatePackService } from './update-pack.service';

@Controller('packs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoles.ADMIN)
export class UpdatePackHttpController {
  private readonly logger = new Logger(UpdatePackHttpController.name);

  constructor(private readonly updatePackService: UpdatePackService) {}

  @Patch(':id')
  async updatePack(
    @Param('id') id: string,
    @Body() { ownerId, ...otherUpdates }: UpdatePackDto,
    @Request() { user: { id: userId } }: { user: AuthenticatedUser },
  ) {
    const command = new UpdatePackCommand({
      packId: new UUID({ uuid: id }),
      updates: {
        ...(ownerId && { ownerId: new UUID({ uuid: ownerId }) }),
        ...otherUpdates,
      },
      metadata: {
        userId: userId.uuid,
      },
    });

    await this.updatePackService.execute(command);

    return { message: 'Pack updated' };
  }
}
