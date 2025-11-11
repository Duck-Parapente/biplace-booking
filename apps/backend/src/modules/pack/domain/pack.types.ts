export interface PackProfile {
  ownerId: string;
  label: string;
  flightsHours?: number;
  flightsCount?: number;
}

export type PackProps = PackProfile;

export type CreatePackProps = PackProfile;
