import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { MaintenanceModeGuard } from '@libs/guards/maintenance-mode.guard';
import { Roles } from '@libs/guards/roles.decorator';
import { RolesGuard } from '@libs/guards/roles.guard';
import { CreateEquipmentNoteCommand } from '@modules/equipment/application/commands/create-equipment-note/create-equipment-note.command';
import { CreateEquipmentNoteService } from '@modules/equipment/application/commands/create-equipment-note/create-equipment-note.service';
import { Body, Controller, Logger, Param, Post, Request, UseGuards } from '@nestjs/common';
import { CreateEquipmentNoteDto, UserRoles } from 'shared';

@Controller('equipments/:equipmentId/notes')
@UseGuards(JwtAuthGuard, RolesGuard, MaintenanceModeGuard)
@Roles(UserRoles.USER)
export class CreateEquipmentNoteHttpController {
  private readonly logger = new Logger(CreateEquipmentNoteHttpController.name);

  constructor(private readonly createEquipmentNoteService: CreateEquipmentNoteService) {}

  @Post()
  async createEquipmentNote(
    @Param('equipmentId') equipmentId: string,
    @Body() dto: CreateEquipmentNoteDto,
    @Request() { user: { id: userId } }: { user: AuthenticatedUser },
  ) {
    const command = new CreateEquipmentNoteCommand({
      props: {
        equipmentId: new UUID({ uuid: equipmentId }),
        content: dto.content,
        createdById: userId,
        createdAt: DateValueObject.fromDate(new Date()),
      },
      metadata: { userId },
    });

    await this.createEquipmentNoteService.execute(command);

    return { message: 'Equipment note created' };
  }
}
