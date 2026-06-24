import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { MaintenanceModeGuard } from '@libs/guards/maintenance-mode.guard';
import { Roles } from '@libs/guards/roles.decorator';
import { RolesGuard } from '@libs/guards/roles.guard';
import { SetEquipmentHolderCommand } from '@modules/equipment/application/commands/set-equipment-holder/set-equipment-holder.command';
import { SetEquipmentHolderService } from '@modules/equipment/application/commands/set-equipment-holder/set-equipment-holder.service';
import {
  Body,
  Controller,
  ForbiddenException,
  Logger,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SetEquipmentHolderDto, UserRoles } from 'shared';

@Controller('equipments/:equipmentId/holder')
@UseGuards(JwtAuthGuard, RolesGuard, MaintenanceModeGuard)
@Roles(UserRoles.USER)
export class SetEquipmentHolderHttpController {
  private readonly logger = new Logger(SetEquipmentHolderHttpController.name);

  constructor(private readonly setEquipmentHolderService: SetEquipmentHolderService) {}

  @Patch()
  async setEquipmentHolder(
    @Param('equipmentId') equipmentId: string,
    @Body() dto: SetEquipmentHolderDto,
    @Request() { user }: { user: AuthenticatedUser },
  ) {
    const holderId = dto.holderId ? new UUID({ uuid: dto.holderId }) : null;

    // A regular user can only take it for themselves or release it.
    // ADMIN/MANAGER can assign it to anyone.
    const isAdminOrManager =
      user.roles.includes(UserRoles.ADMIN) || user.roles.includes(UserRoles.MANAGER);
    if (!isAdminOrManager && holderId && holderId.uuid !== user.id.uuid) {
      throw new ForbiddenException({
        label: 'Tu peux seulement la prendre pour toi ou la rendre.',
        message: 'User can only assign the equipment to themselves',
      });
    }

    const command = new SetEquipmentHolderCommand({
      equipmentId: new UUID({ uuid: equipmentId }),
      holderId,
      metadata: { userId: user.id },
    });

    await this.setEquipmentHolderService.execute(command);

    return { message: 'Equipment holder updated' };
  }
}
