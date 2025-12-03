import { ReservationOrWishStatusDto } from 'shared';

export const useReservationWishStatus = () => {
  const STATUS_CONFIG: Record<
    ReservationOrWishStatusDto,
    { label: string; classes: string; infoText?: string }
  > = {
    [ReservationOrWishStatusDto.PENDING]: {
      label: 'En attente',
      classes: 'bg-yellow-200 text-yellow-800',
    },
    [ReservationOrWishStatusDto.CONFIRMED]: {
      label: 'Confirmée',
      classes: 'bg-green-200 text-green-800',
    },
    [ReservationOrWishStatusDto.REFUSED]: {
      label: 'Refusée',
      classes: 'bg-red-200 text-red-800',
      infoText: "Les packs sélectionnés ont été attribués à d'autres pilotes pour le moment.",
    },
    [ReservationOrWishStatusDto.CANCELLED]: {
      label: 'Annulée',
      classes: 'bg-gray-200 text-gray-800',
    },
  };

  const getConfigFromStatus = (status: ReservationOrWishStatusDto) => {
    return STATUS_CONFIG[status] || STATUS_CONFIG[ReservationOrWishStatusDto.CANCELLED];
  };

  const getStatusLabel = (status: ReservationOrWishStatusDto): string => {
  return STATUS_CONFIG[status]?.label || status;
};

  return {
    STATUS_CONFIG,
    getConfigFromStatus,
    getStatusLabel,
  };
};
