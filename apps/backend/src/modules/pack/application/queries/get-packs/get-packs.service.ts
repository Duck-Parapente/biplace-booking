import { UUID } from '@libs/ddd/uuid.value-object';
import { PackEntity } from '@modules/pack/domain/pack.entity';
import { PackRepositoryPort } from '@modules/pack/domain/ports/pack.repository.port';
import { PACK_REPOSITORY } from '@modules/pack/pack.di-tokens';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GetPacksService {
  private readonly logger = new Logger(GetPacksService.name);

  constructor(
    @Inject(PACK_REPOSITORY)
    private readonly packRepository: PackRepositoryPort,
  ) {}

  async execute(): Promise<PackEntity[]> {
    return this.packRepository.findAll();
  }

  async isPackOwnedByUser(packId: UUID, userId: UUID): Promise<boolean> {
    return this.packRepository.isPackOwnedByUser(packId, userId);
  }
}
