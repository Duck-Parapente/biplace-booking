import { DateValueObject } from '@libs/ddd/date.value-object';
import { Integer } from '@libs/ddd/integer.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

export interface PackSummary {
  id: UUID;
  label: string;
}

export interface ReservationWishForAttribution {
  id: UUID;
  packChoices: { id: UUID; label: string; order: Integer }[];
  createdAt: DateValueObject;
  publicComment?: string;
  user: {
    id: UUID;
    nickname: string;
    currentScore: number;
  };
}
