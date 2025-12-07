import { UUID } from '@libs/ddd/uuid.value-object';

import { FlightLogProps } from '../reservation.types';

export interface FlightLogRepositoryPort {
  create(reservationId: UUID, flightLog: FlightLogProps): Promise<void>;
}
