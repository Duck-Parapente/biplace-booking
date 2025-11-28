import { PackRepositoryPort } from '@modules/pack/domain/ports/pack.repository.port';
import { PACK_REPOSITORY } from '@modules/pack/pack.di-tokens';
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdatePackCommand } from './update-pack.command';

@CommandHandler(UpdatePackCommand)
export class UpdatePackService implements ICommandHandler<UpdatePackCommand, void> {
  private readonly logger = new Logger(UpdatePackService.name);

  constructor(
    @Inject(PACK_REPOSITORY)
    protected readonly packRepository: PackRepositoryPort,
  ) {}

  async execute({ packId, updates, metadata }: UpdatePackCommand): Promise<void> {
    const pack = await this.packRepository.findById(packId);

    if (!pack) {
      throw new NotFoundException(`Pack with id ${packId.uuid} not found`);
    }

    pack.update(updates, metadata);

    await this.packRepository.update(pack);
  }
}
