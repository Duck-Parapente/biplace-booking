import { DateValueObject } from '@libs/ddd/date.value-object';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { PackEntity } from '../domain/pack.entity';
import { PackRepositoryPort } from '../domain/ports/pack.repository.port';
import { PACK_REPOSITORY } from '../pack.di-tokens';

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

  async getAvailablePacks(
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<PackEntity[]> {
    return this.packRepository.findAvailablePacks(startingDate, endingDate);
  }
}
