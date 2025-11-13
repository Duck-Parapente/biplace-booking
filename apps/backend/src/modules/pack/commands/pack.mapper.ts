import { PackDto } from 'shared';

import { PackEntity } from '../domain/pack.entity';

export function mapPackToDto(pack: PackEntity): PackDto {
  return {
    id: pack.id.uuid,
    ownerId: pack.ownerId.uuid,
    label: pack.label,
    flightsHours: pack.flightsHours,
    flightsCount: pack.flightsCount,
  };
}
