import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { MaintenanceModeGuard } from '@libs/guards/maintenance-mode.guard';
import { Roles } from '@libs/guards/roles.decorator';
import { RolesGuard } from '@libs/guards/roles.guard';
import { UpdatePackCommand } from '@modules/pack/application/commands/update-pack/update-pack.command';
import { UpdatePackService } from '@modules/pack/application/commands/update-pack/update-pack.service';
import { GetPacksService } from '@modules/pack/application/queries/get-packs/get-packs.service';
import {
  Controller,
  Patch,
  Body,
  Logger,
  UseGuards,
  Param,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UpdatePackDto, UserRoles } from 'shared';

@Controller('packs')
@UseGuards(JwtAuthGuard, RolesGuard, MaintenanceModeGuard)
@Roles(UserRoles.ADMIN, UserRoles.MANAGER)
export class UpdatePackHttpController {
  private readonly logger = new Logger(UpdatePackHttpController.name);

  constructor(
    private readonly updatePackService: UpdatePackService,
    private readonly getPacksService: GetPacksService,
  ) {}

  @Patch(':id')
  async updatePack(
    @Param('id') id: string,
    @Body() { ownerId, lastControlDate, lastRescueFoldingDate, ...otherUpdates }: UpdatePackDto,
    @Request() { user: { id: userId, roles } }: { user: AuthenticatedUser },
  ) {
    const packId = new UUID({ uuid: id });
    const isUserAllowedToManagePack = await this.getPacksService.isUserAllowedToManagePack(
      packId,
      userId,
      roles,
    );

    if (!isUserAllowedToManagePack) {
      throw new ForbiddenException('User is not allowed to update this pack');
    }

    const command = new UpdatePackCommand({
      packId,
      updates: {
        ...(ownerId && { ownerId: new UUID({ uuid: ownerId }) }),
        ...(lastControlDate && {
          lastControlDate: DateValueObject.fromDateString(lastControlDate),
        }),
        ...(lastRescueFoldingDate && {
          lastRescueFoldingDate: DateValueObject.fromDateString(lastRescueFoldingDate),
        }),
        ...otherUpdates,
      },
      metadata: {
        userId,
      },
    });

    await this.updatePackService.execute(command);

    return { message: 'Pack updated' };
  }
}
