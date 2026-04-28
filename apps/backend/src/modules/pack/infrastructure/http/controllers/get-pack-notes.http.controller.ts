import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { Roles } from '@libs/guards/roles.decorator';
import { RolesGuard } from '@libs/guards/roles.guard';
import { GetPackNotesService } from '@modules/pack/application/queries/get-pack-notes/get-pack-notes.service';
import { Controller, Get, Logger, Param, UseGuards } from '@nestjs/common';
import { PackNoteDto, UserRoles } from 'shared';

import { mapPackNoteToDto } from '../mappers/pack-note.mapper';

@Controller('packs/:packId/notes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoles.USER)
export class GetPackNotesHttpController {
  private readonly logger = new Logger(GetPackNotesHttpController.name);

  constructor(private readonly getPackNotesService: GetPackNotesService) {}

  @Get()
  async getPackNotes(@Param('packId') packId: string): Promise<PackNoteDto[]> {
    const packNotes = await this.getPackNotesService.execute(new UUID({ uuid: packId }));
    return packNotes.map(mapPackNoteToDto);
  }
}
