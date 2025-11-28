import { DateValueObject } from '@libs/ddd/date.value-object';
import { PackSummary } from '@libs/types/accross-modules';
import { PackEntity } from '@modules/pack/domain/pack.entity';
import { PackRepositoryPort } from '@modules/pack/domain/ports/pack.repository.port';
import { PACK_REPOSITORY } from '@modules/pack/pack.di-tokens';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GetPacksService {
  private readonly logger = new Logger(GetPacksService.name);

  constructor(
    @Inject(PACK_REPOSITORY)
    protected readonly packRepository: PackRepositoryPort,
  ) {}

  async execute(): Promise<PackEntity[]> {
    return this.packRepository.findAll();
  }

  async findAvailablePacks(
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<PackSummary[]> {
    return this.packRepository.findAvailablePacks(startingDate, endingDate);
  }
}
