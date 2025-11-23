import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

interface ReservationWishSummary {
  id: UUID;
  userScore: number;
  userId: UUID;
  packChoices: UUID[];
  createdAt: DateValueObject;
}

export interface BaseValidationEngineProps {
  availablePacks: UUID[];
  reservationWishes: ReservationWishSummary[];
}

export interface Attribution {
  reservationWishId: UUID;
  assignedPackId: UUID;
}
