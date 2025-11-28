import { PackEntity } from '@modules/pack/domain/pack.entity';
import { PackDto } from 'shared';

export function mapPackToDto(pack: PackEntity): PackDto {
  return {
    id: pack.id.uuid,
    ownerId: pack.ownerId.uuid,
    label: pack.label,
    flightsHours: pack.flightsHours,
    flightsCount: pack.flightsCount,
  };
}
