import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { MaintenanceModeGuard } from '@libs/guards/maintenance-mode.guard';
import { Roles } from '@libs/guards/roles.decorator';
import { RolesGuard } from '@libs/guards/roles.guard';
import { UpdateEquipmentNoteCommand } from '@modules/equipment/application/commands/update-equipment-note/update-equipment-note.command';
import { UpdateEquipmentNoteService } from '@modules/equipment/application/commands/update-equipment-note/update-equipment-note.service';
import { EquipmentNoteRepositoryPort } from '@modules/equipment/domain/ports/equipment-note.repository.port';
import { EQUIPMENT_NOTE_REPOSITORY } from '@modules/equipment/equipment.di-tokens';
import {
  Body,
  Controller,
  ForbiddenException,
  Inject,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UpdateEquipmentNoteDto, UserRoles } from 'shared';

@Controller('equipments/:equipmentId/notes')
@UseGuards(JwtAuthGuard, RolesGuard, MaintenanceModeGuard)
@Roles(UserRoles.USER)
export class UpdateEquipmentNoteHttpController {
  private readonly logger = new Logger(UpdateEquipmentNoteHttpController.name);

  constructor(
    private readonly updateEquipmentNoteService: UpdateEquipmentNoteService,
    @Inject(EQUIPMENT_NOTE_REPOSITORY)
    private readonly equipmentNoteRepository: EquipmentNoteRepositoryPort,
  ) {}

  @Patch(':noteId')
  async updateEquipmentNote(
    @Param('noteId') noteId: string,
    @Body() dto: UpdateEquipmentNoteDto,
    @Request() { user: { id: userId } }: { user: AuthenticatedUser },
  ) {
    const noteUUID = new UUID({ uuid: noteId });
    const equipmentNote = await this.equipmentNoteRepository.findById(noteUUID);

    if (!equipmentNote) {
      throw new NotFoundException({ message: `EquipmentNote ${noteId} not found` });
    }

    if (equipmentNote.createdById.uuid !== userId.uuid) {
      throw new ForbiddenException({
        label: "Tu n'es pas autorisé à modifier cette note.",
        message: 'User is not the creator of this equipment note',
      });
    }

    const command = new UpdateEquipmentNoteCommand({
      noteId: noteUUID,
      updates: { content: dto.content },
      metadata: { userId },
    });

    await this.updateEquipmentNoteService.execute(command);

    return { message: 'Equipment note updated' };
  }
}
