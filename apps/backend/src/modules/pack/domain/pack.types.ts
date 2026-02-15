import { UUID } from '@libs/ddd/uuid.value-object';

export interface PackProfile {
  ownerId: UUID;
  label: string;
  flightsHours?: number;
  flightsCount?: number;
  description?: string | null;
}

export type PackProps = Required<PackProfile> & {
  order: number;
};

export type CreatePackProps = PackProfile;

export type UpdatePackProps = Partial<PackProfile>;
