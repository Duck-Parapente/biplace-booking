// Profile subset used for update operations
export interface CreatePackDto {
  ownerId: string;
  label: string;
  flightsHours?: number;
  flightsCount?: number;
}

export interface UpdatePackDto {
  ownerId?: string;
  label?: string;
  flightsHours?: number;
  flightsCount?: number;
}

export interface PackDto {
  id: string;
  ownerId: string;
  label: string;
  flightsHours: number;
  flightsCount: number;
}
