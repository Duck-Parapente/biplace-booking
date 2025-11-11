import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PackEntity } from '../domain/pack.entity';
import { PackRepositoryPort } from '../domain/ports/pack.repository.port';
import { PACK_REPOSITORY } from '../pack.di-tokens';

import { CreatePackCommand } from './create-pack.command';

@CommandHandler(CreatePackCommand)
export class CreatePackService implements ICommandHandler<CreatePackCommand, void> {
  private readonly logger = new Logger(CreatePackService.name);

  constructor(
    @Inject(PACK_REPOSITORY)
    protected readonly packRepository: PackRepositoryPort,
  ) {}

  async execute({ profile }: CreatePackCommand): Promise<void> {
    const pack = PackEntity.create(profile);

    await this.packRepository.create(pack);

    this.logger.log(`Pack created: ${pack.id}`);
  }
}
