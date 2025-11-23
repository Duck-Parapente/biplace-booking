import { DateValueObject } from '@libs/ddd/date.value-object';
import { PackSummary } from '@libs/types/accross-modules';
import { GetPacksService } from '@modules/pack/commands/get-packs.service';
import { Injectable, Logger } from '@nestjs/common';

import { PackRepositoryPort } from '../domain/ports/pack.repository.port';

@Injectable()
export class PackRepository implements PackRepositoryPort {
  private readonly logger = new Logger(PackRepository.name);

  constructor(readonly getPacksService: GetPacksService) {}

  async findAvailablePacks(
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<PackSummary[]> {
    return this.getPacksService.getAvailablePacks(startingDate, endingDate);
  }
}
