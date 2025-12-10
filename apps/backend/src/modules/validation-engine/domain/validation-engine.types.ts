import { UUID } from '@libs/ddd/uuid.value-object';
import { ReservationWishForAttribution } from '@libs/types/accross-modules';

export const VALIDATION_ENGINE_MODULE = {
  userId: new UUID({ uuid: '00000000-0000-0000-0000-000000000000' }),
};

export interface EnginePack {
  id: UUID;
  label: string;
}

export interface BaseValidationEngineProps {
  availablePacks: EnginePack[];
  reservationWishes: ReservationWishForAttribution[];
}

export interface Attribution {
  reservationWishId: UUID;
  assignedPackId: UUID;
}
