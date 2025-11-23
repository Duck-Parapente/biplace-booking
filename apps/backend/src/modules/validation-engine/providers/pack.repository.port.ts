import { DateValueObject } from '@libs/ddd/date.value-object';
import { GetPacksService } from '@modules/pack/commands/get-packs.service';
import { Injectable, Logger } from '@nestjs/common';

import { PackRepositoryPort } from '../domain/ports/pack.repository.port';
import { PackSummary } from '../domain/validation-engine.types';

@Injectable()
export class PackRepository implements PackRepositoryPort {
  private readonly logger = new Logger(PackRepository.name);

  constructor(readonly getPacksService: GetPacksService) {}

  async findAvailablePacks(
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<PackSummary[]> {
    const packs = await this.getPacksService.getAvailablePacks(startingDate, endingDate);

    return packs.map(({ id }) => ({
      id,
    }));
  }
}
