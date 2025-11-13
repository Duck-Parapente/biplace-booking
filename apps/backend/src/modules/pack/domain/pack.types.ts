import { UUID } from '@libs/ddd/uuid.value-object';

export interface PackProfile {
  ownerId: UUID;
  label: string;
  flightsHours?: number;
  flightsCount?: number;
}

export type PackProps = PackProfile;

export type CreatePackProps = PackProfile;

export type UpdatePackProps = Partial<PackProfile>;
