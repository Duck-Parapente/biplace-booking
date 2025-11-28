import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { Injectable } from '@nestjs/common';

import { ReservationWishProps } from './reservation-wish.types';
import { PlanningData, PlanningPackData, ReservationProps } from './reservation.types';

type PackInfo = {
  id: UUID;
  label: string;
};

@Injectable()
export class PlanningDomainService {
  /**
   * Build planning data from raw data sources
   * - For past dates (<= today): only show packs with reservations
   * - For current/future dates (>= today): show all packs with reservations and wishes
   */
  buildPlanningData(
    startDate: DateValueObject,
    endDate: DateValueObject,
    packs: PackInfo[],
    reservations: ReservationProps[],
    pendingWishes: ReservationWishProps[],
  ): PlanningData[] {
    const today = DateValueObject.now();
    const dates = this.generateDateRange(startDate, endDate);

    return dates.map((date) => {
      const isPastDate = date.value <= today.value;

      const packsForDate = this.buildPacksForDate(
        date,
        packs,
        reservations,
        pendingWishes,
        isPastDate,
      );

      return {
        date,
        packs: packsForDate,
      };
    });
  }

  private generateDateRange(
    startDate: DateValueObject,
    endDate: DateValueObject,
  ): DateValueObject[] {
    const dates: DateValueObject[] = [];
    const currentDate = new Date(startDate.value);
    const endDateTime = endDate.value.getTime();

    while (currentDate.getTime() <= endDateTime) {
      dates.push(DateValueObject.fromDate(new Date(currentDate)));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  private buildPacksForDate(
    date: DateValueObject,
    allPacks: PackInfo[],
    reservations: ReservationProps[],
    pendingWishes: ReservationWishProps[],
    isPastDate: boolean,
  ): PlanningPackData[] {
    const packsForDate: PlanningPackData[] = [];

    for (const pack of allPacks) {
      const reservation = this.findReservationForPackAndDate(reservations, pack.id, date);

      // For past dates, only include packs with reservations
      if (isPastDate && !reservation) {
        continue;
      }

      const pendingWishesCount = isPastDate
        ? 0
        : this.countPendingWishesForPackAndDate(pendingWishes, pack.id, date);

      packsForDate.push({
        packId: { uuid: pack.id.uuid },
        packLabel: pack.label,
        pendingWishesCount,
        reservation: reservation || null,
      });
    }

    return packsForDate;
  }

  private findReservationForPackAndDate(
    reservations: ReservationProps[],
    packId: UUID,
    date: DateValueObject,
  ): ReservationProps | undefined {
    return reservations.find(
      (r) =>
        r.packId.uuid === packId.uuid &&
        r.startingDate.value <= date.value &&
        r.endingDate.value >= date.value,
    );
  }

  private countPendingWishesForPackAndDate(
    pendingWishes: ReservationWishProps[],
    packId: UUID,
    date: DateValueObject,
  ): number {
    return pendingWishes.filter(
      (w) =>
        w.startingDate.value.getTime() === date.value.getTime() &&
        w.packChoices.some((pc) => pc.uuid === packId.uuid),
    ).length;
  }
}
