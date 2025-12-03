import { ReservationWishStatusDto } from 'shared';

export type ConfigType = { label: string; classes: string; infoText?: string };

export const useReservationWishStatus = () => {
  const STATUS_CONFIG: Record<ReservationWishStatusDto, ConfigType> = {
    [ReservationWishStatusDto.PENDING]: {
      label: 'En attente',
      classes: 'bg-yellow-200 text-yellow-800',
    },
    [ReservationWishStatusDto.CONFIRMED]: {
      label: 'Confirmée',
      classes: 'bg-green-200 text-green-800',
    },
    [ReservationWishStatusDto.REFUSED]: {
      label: 'Refusée',
      classes: 'bg-red-200 text-red-800',
      infoText: "Les packs sélectionnés ont été attribués à d'autres pilotes pour le moment.",
    },
    [ReservationWishStatusDto.CANCELLED]: {
      label: 'Annulée',
      classes: 'bg-gray-200 text-gray-800',
    },
  };

  const getConfigFromStatus = (status: ReservationWishStatusDto): ConfigType => {
    return (
      STATUS_CONFIG[status] || (STATUS_CONFIG[ReservationWishStatusDto.CANCELLED] as ConfigType)
    );
  };

  const getStatusLabel = (status: ReservationWishStatusDto): string => {
    return STATUS_CONFIG[status]?.label || status;
  };

  return {
    STATUS_CONFIG,
    getConfigFromStatus,
    getStatusLabel,
  };
};
