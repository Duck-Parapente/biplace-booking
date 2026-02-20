import { PackEntity } from '@modules/pack/domain/pack.entity';
import { format } from 'date-fns';
import { PackDto } from 'shared';

export function mapPackToDto(pack: PackEntity): PackDto {
  return {
    id: pack.id.uuid,
    ownerId: pack.ownerId.uuid,
    label: pack.label,
    flightsHours: pack.flightsHours,
    flightsCount: pack.flightsCount,
    description: pack.description,
    details: pack.details,
    lastControlDate: pack.lastControlDate ? format(pack.lastControlDate.value, 'yyyy-MM-dd') : null,
    lastRescueFoldingDate: pack.lastRescueFoldingDate
      ? format(pack.lastRescueFoldingDate.value, 'yyyy-MM-dd')
      : null,
    order: pack.order,
  };
}
