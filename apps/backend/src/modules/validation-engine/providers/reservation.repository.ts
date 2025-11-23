import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { GetReservationsService } from '@modules/reservation/commands/get-reservations.service';
import { Injectable, Logger } from '@nestjs/common';

import { ReservationRepositoryPort } from '../domain/ports/reservation.repository.port';

@Injectable()
export class ReservationRepository implements ReservationRepositoryPort {
  private readonly logger = new Logger(ReservationRepository.name);

  constructor(readonly getReservationsService: GetReservationsService) {}

  existsByPackAndDate(
    packId: UUID,
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<boolean> {
    return this.getReservationsService.existsByPackAndDate(packId, startingDate, endingDate);
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
