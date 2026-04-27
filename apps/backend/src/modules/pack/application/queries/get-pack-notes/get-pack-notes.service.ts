import { UUID } from '@libs/ddd/uuid.value-object';
import { PackNoteEntity } from '@modules/pack/domain/pack-note.entity';
import { PackNoteRepositoryPort } from '@modules/pack/domain/ports/pack-note.repository.port';
import { PACK_NOTE_REPOSITORY } from '@modules/pack/pack.di-tokens';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GetPackNotesService {
  private readonly logger = new Logger(GetPackNotesService.name);

  constructor(
    @Inject(PACK_NOTE_REPOSITORY)
    private readonly packNoteRepository: PackNoteRepositoryPort,
  ) {}

  async execute(packId: UUID): Promise<PackNoteEntity[]> {
    return this.packNoteRepository.findByPackId(packId);
  }
}
