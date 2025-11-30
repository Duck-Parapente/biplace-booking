import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

export interface PackSummary {
  id: UUID;
  label: string;
}

export interface ReservationWishForAttribution {
  id: UUID;
  packChoices: { id: UUID; label: string }[];
  createdAt: DateValueObject;
  publicComment?: string;
  user: {
    id: UUID;
    nickname: string;
    currentScore: number;
  };
}
