import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';

export interface PackProfile {
  ownerId: UUID;
  label: string;
  flightsHours?: number;
  flightsCount?: number;
  description?: string | null;
  details?: string | null;
  lastControlDate?: DateValueObject | null;
  lastRescueFoldingDate?: DateValueObject | null;
}

export type PackProps = Required<PackProfile> & {
  order: number;
};

export type CreatePackProps = PackProfile;

export type UpdatePackProps = Partial<PackProfile>;
