import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { MaintenanceModeGuard } from '@libs/guards/maintenance-mode.guard';
import { Roles } from '@libs/guards/roles.decorator';
import { RolesGuard } from '@libs/guards/roles.guard';
import { UpdatePackNoteCommand } from '@modules/pack/application/commands/update-pack-note/update-pack-note.command';
import { UpdatePackNoteService } from '@modules/pack/application/commands/update-pack-note/update-pack-note.service';
import { PackNoteRepositoryPort } from '@modules/pack/domain/ports/pack-note.repository.port';
import { PACK_NOTE_REPOSITORY } from '@modules/pack/pack.di-tokens';
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
import { UpdatePackNoteDto, UserRoles } from 'shared';

@Controller('packs/:packId/notes')
@UseGuards(JwtAuthGuard, RolesGuard, MaintenanceModeGuard)
@Roles(UserRoles.USER)
export class UpdatePackNoteHttpController {
  private readonly logger = new Logger(UpdatePackNoteHttpController.name);

  constructor(
    private readonly updatePackNoteService: UpdatePackNoteService,
    @Inject(PACK_NOTE_REPOSITORY)
    private readonly packNoteRepository: PackNoteRepositoryPort,
  ) {}

  @Patch(':noteId')
  async updatePackNote(
    @Param('noteId') noteId: string,
    @Body() dto: UpdatePackNoteDto,
    @Request() { user: { id: userId } }: { user: AuthenticatedUser },
  ) {
    const noteUUID = new UUID({ uuid: noteId });
    const packNote = await this.packNoteRepository.findById(noteUUID);

    if (!packNote) {
      throw new NotFoundException({ message: `PackNote ${noteId} not found` });
    }

    if (packNote.createdById.uuid !== userId.uuid) {
      throw new ForbiddenException({
        label: "Tu n'es pas autorisé à modifier cette note.",
        message: 'User is not the creator of this pack note',
      });
    }

    const command = new UpdatePackNoteCommand({
      noteId: noteUUID,
      updates: { content: dto.content },
      metadata: { userId },
    });

    await this.updatePackNoteService.execute(command);

    return { message: 'Pack note updated' };
  }
}
