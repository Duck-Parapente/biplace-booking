import { UUID } from '@libs/ddd/uuid.value-object';
import { ReservationWishSummary } from '@libs/types/accross-modules';

export interface BaseValidationEngineProps {
  availablePacks: UUID[];
  reservationWishes: ReservationWishSummary[];
}

export interface Attribution {
  reservationWishId: UUID;
  assignedPackId: UUID;
}
