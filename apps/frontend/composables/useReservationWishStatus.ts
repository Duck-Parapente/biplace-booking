import { ReservationWishStatusDto } from 'shared';

export type ConfigType = { label: string; classes: string; infoText?: string };

export const useReservationWishStatus = () => {
  const STATUS_CONFIG: Record<ReservationWishStatusDto, ConfigType> = {
    [ReservationWishStatusDto.PENDING]: {
      label: 'En attente',
      classes: 'bg-yellow-50 text-yellow-700 border border-yellow-700',
    },
    [ReservationWishStatusDto.CONFIRMED]: {
      label: 'Confirmée',
      classes: 'bg-green-50 text-green-700 border border-green-700',
    },
    [ReservationWishStatusDto.CLOSED]: {
      label: 'Clôturée',
      classes: 'bg-green-50 text-green-700 border border-green-700',
    },
    [ReservationWishStatusDto.REFUSED]: {
      label: 'Refusée',
      classes: 'bg-red-50 text-red-700 border border-red-700',
      infoText: "Les packs sélectionnés ont été attribués à d'autres pilotes pour le moment.",
    },
    [ReservationWishStatusDto.CANCELLED]: {
      label: 'Annulée',
      classes: 'bg-gray-50 text-gray-700 border border-gray-700',
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
