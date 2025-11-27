import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

export class CannotCreateReservationError extends Error {
  constructor(packId: UUID, startingDate: DateValueObject) {
    super(
      `Cannot create reservation for pack ID ${packId.uuid} on starting date ${startingDate.value.toISOString()}.`,
    );
    this.name = CannotCreateReservationError.name;
  }
}
