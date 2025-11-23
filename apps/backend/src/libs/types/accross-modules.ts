import { DateValueObject } from "@libs/ddd/date.value-object";
import { UUID } from "@libs/ddd/uuid.value-object";

export interface PackSummary {
  id: UUID;
}

export interface ReservationWishSummary {
  id: UUID;
  packChoices: UUID[];
  createdAt: DateValueObject;
  publicComment?: string;
  createdBy: {
    id: UUID;
    currentScore: number;
  };
}