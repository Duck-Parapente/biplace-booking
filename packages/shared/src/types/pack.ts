// Profile subset used for update operations
export interface CreatePackDto {
  ownerId: string;
  label: string;
  flightsHours?: number;
  flightsCount?: number;
}
