import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PackRepositoryPort } from '../domain/ports/pack.repository.port';
import { PACK_REPOSITORY } from '../pack.di-tokens';

import { UpdatePackCommand } from './update-pack.command';

@CommandHandler(UpdatePackCommand)
export class UpdatePackService implements ICommandHandler<UpdatePackCommand, void> {
  private readonly logger = new Logger(UpdatePackService.name);

  constructor(
    @Inject(PACK_REPOSITORY)
    protected readonly packRepository: PackRepositoryPort,
  ) {}

  async execute({ packId, updates }: UpdatePackCommand): Promise<void> {
    const pack = await this.packRepository.findById(packId);

    if (!pack) {
      throw new NotFoundException(`Pack with id ${packId.uuid} not found`);
    }

    pack.update(updates);

    await this.packRepository.update(pack);
  }
}
