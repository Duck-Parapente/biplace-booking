import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { Injectable, Logger } from '@nestjs/common';

import { ReservationRepositoryPort } from '../domain/ports/reservation.repository.port';
import { ReservationWishSummary } from '@libs/types/accross-modules';

@Injectable()
export class ReservationRepository implements ReservationRepositoryPort {
  private readonly logger = new Logger(ReservationRepository.name);

  constructor() {}

  findByPackAndDate(
    packId: UUID,
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<ReservationWishSummary | null> {
    this.logger.log(
      `Finding reservation for pack ${packId.uuid} between ${startingDate.toString()} and ${endingDate.toString()}`,
    );
    throw new Error('Method not implemented.');
  }

  create(props: {
    packId: UUID;
    userId: UUID;
    startingDate: DateValueObject;
    endingDate: DateValueObject;
    reservationWishId: UUID;
    publicComment: string;
  }): Promise<void> {
    this.logger.log(`Creating reservation for pack ${props.packId.uuid}`);
    throw new Error('Method not implemented.');
  }
}
