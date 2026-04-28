import { PackNoteRepositoryPort } from '@modules/pack/domain/ports/pack-note.repository.port';
import { PACK_NOTE_REPOSITORY } from '@modules/pack/pack.di-tokens';
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdatePackNoteCommand } from './update-pack-note.command';

@CommandHandler(UpdatePackNoteCommand)
export class UpdatePackNoteService implements ICommandHandler<UpdatePackNoteCommand, void> {
  private readonly logger = new Logger(UpdatePackNoteService.name);

  constructor(
    @Inject(PACK_NOTE_REPOSITORY)
    private readonly packNoteRepository: PackNoteRepositoryPort,
  ) {}

  async execute({ noteId, updates }: UpdatePackNoteCommand): Promise<void> {
    const packNote = await this.packNoteRepository.findById(noteId);
    if (!packNote) {
      throw new NotFoundException({ message: `PackNote ${noteId.uuid} not found` });
    }

    packNote.update(updates);
    await this.packNoteRepository.update(packNote);
  }
}
