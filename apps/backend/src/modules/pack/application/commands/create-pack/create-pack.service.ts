import { PackEntity } from '@modules/pack/domain/pack.entity';
import { PackRepositoryPort } from '@modules/pack/domain/ports/pack.repository.port';
import { PACK_REPOSITORY } from '@modules/pack/pack.di-tokens';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreatePackCommand } from './create-pack.command';

@CommandHandler(CreatePackCommand)
export class CreatePackService implements ICommandHandler<CreatePackCommand, void> {
  private readonly logger = new Logger(CreatePackService.name);

  constructor(
    @Inject(PACK_REPOSITORY)
    private readonly packRepository: PackRepositoryPort,
  ) {}

  async execute({ profile, metadata }: CreatePackCommand): Promise<void> {
    const pack = PackEntity.create(profile, metadata);

    await this.packRepository.create(pack);
  }
}
