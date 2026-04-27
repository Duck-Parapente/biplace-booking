import { PackNoteEntity } from '@modules/pack/domain/pack-note.entity';
import { PackNoteRepositoryPort } from '@modules/pack/domain/ports/pack-note.repository.port';
import { PACK_NOTE_REPOSITORY } from '@modules/pack/pack.di-tokens';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreatePackNoteCommand } from './create-pack-note.command';

@CommandHandler(CreatePackNoteCommand)
export class CreatePackNoteService implements ICommandHandler<CreatePackNoteCommand, void> {
  private readonly logger = new Logger(CreatePackNoteService.name);

  constructor(
    @Inject(PACK_NOTE_REPOSITORY)
    private readonly packNoteRepository: PackNoteRepositoryPort,
  ) {}

  async execute({ props, metadata }: CreatePackNoteCommand): Promise<void> {
    const packNote = PackNoteEntity.create(props, metadata);
    await this.packNoteRepository.create(packNote);
  }
}
