import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { Roles } from '@libs/guards/roles.decorator';
import { RolesGuard } from '@libs/guards/roles.guard';
import { GetEquipmentNotesService } from '@modules/equipment/application/queries/get-equipment-notes/get-equipment-notes.service';
import { Controller, Get, Logger, Param, UseGuards } from '@nestjs/common';
import { EquipmentNoteDto, UserRoles } from 'shared';

import { mapEquipmentNoteToDto } from '../mappers/equipment-note.mapper';

@Controller('equipments/:equipmentId/notes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoles.USER)
export class GetEquipmentNotesHttpController {
  private readonly logger = new Logger(GetEquipmentNotesHttpController.name);

  constructor(private readonly getEquipmentNotesService: GetEquipmentNotesService) {}

  @Get()
  async getEquipmentNotes(@Param('equipmentId') equipmentId: string): Promise<EquipmentNoteDto[]> {
    const equipmentNotes = await this.getEquipmentNotesService.execute(
      new UUID({ uuid: equipmentId }),
    );
    return equipmentNotes.map(mapEquipmentNoteToDto);
  }
}
