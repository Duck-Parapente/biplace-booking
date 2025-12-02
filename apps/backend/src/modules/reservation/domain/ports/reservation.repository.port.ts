import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

import { ReservationEntity } from '../reservation.entity';
import { ReservationProps } from '../reservation.types';

export interface ReservationRepositoryPort {
  create(reservationEntity: ReservationEntity): Promise<void>;
  existsByPackAndDate(
    packId: UUID,
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<boolean>;
  findReservationsByDateRange(
    startDate: DateValueObject,
    endDate: DateValueObject,
  ): Promise<ReservationProps[]>;
  findById(id: UUID): Promise<ReservationEntity | null>;
  updateStatus(reservation: ReservationEntity): Promise<void>;
}
