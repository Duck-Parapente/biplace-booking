import { DateValueObject } from '@libs/ddd/date.value-object';
import { Inject, Injectable, Logger } from '@nestjs/common';

import {
  RESERVATION_WISH_REPOSITORY,
  PACK_REPOSITORY,
  RESERVATION_REPOSITORY,
} from '../validation-engine.di-tokens';

import { AttributionDomainService } from './attibution.domain-service';
import { PackRepositoryPort } from './ports/pack.repository.port';
import { ReservationWishRepositoryPort } from './ports/reservation-wish.repository.port';
import { ReservationRepositoryPort } from './ports/reservation.repository.port';
import { Attribution, ReservationWishSummary } from './validation-engine.types';

@Injectable()
export class AttributePacksDomainService {
  private readonly logger = new Logger(AttributePacksDomainService.name);
  private readonly ATTRIBUTION_START_DAY_OFFSET = 1;
  private readonly ATTRIBUTION_END_DAY_OFFSET = 5;

  constructor(
    @Inject(RESERVATION_WISH_REPOSITORY)
    private readonly reservationWishRepository: ReservationWishRepositoryPort,
    @Inject(PACK_REPOSITORY)
    private readonly packRepository: PackRepositoryPort,
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepositoryPort,
    private readonly attributionDomainService: AttributionDomainService,
  ) {}

  async attributePacks(): Promise<void> {
    const todayNormalized = DateValueObject.now();

    for (
      let dayOffset = this.ATTRIBUTION_START_DAY_OFFSET;
      dayOffset <= this.ATTRIBUTION_END_DAY_OFFSET;
      dayOffset++
    ) {
      const startingDate = todayNormalized.startOfDayInUTC(dayOffset);
      const endingDate = startingDate.startOfDayInUTC(1);

      this.logger.log(`Processing attributions for ${startingDate.value.toISOString()}`);

      await this.processAttributionsForDate(startingDate, endingDate);
    }

    this.logger.log('Attribution process completed');
  }

  private async processAttributionsForDate(
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<void> {
    const pendingWishes =
      await this.reservationWishRepository.findPendingAndRefusedByStartingDate(startingDate);

    if (pendingWishes.length === 0) {
      this.logger.log(`No pending wishes for ${startingDate.value.toISOString()}`);
      return;
    }

    const availablePacks = await this.packRepository.findAvailablePacks(startingDate, endingDate);

    if (availablePacks.length === 0) {
      this.logger.log(`No available packs for ${startingDate.value.toISOString()}`);
      return;
    }

    this.logger.log(
      `Found ${pendingWishes.length} pending wishes and ${availablePacks.length} available packs`,
    );

    const attributions = await this.attributionDomainService.getAttributions({
      availablePacks: availablePacks.map((p) => p.id),
      reservationWishes: pendingWishes,
    });

    this.logger.log(`Generated ${attributions.length} attributions`);

    await this.createReservations(attributions, pendingWishes, startingDate, endingDate);

    await this.refuseUnattributedWishes(attributions, pendingWishes);
  }

  private async createReservations(
    attributions: Attribution[],
    pendingWishes: ReservationWishSummary[],
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<void> {
    for (const attribution of attributions) {
      const wish = pendingWishes.find((w) => w.id.uuid === attribution.reservationWishId.uuid);
      if (!wish) {
        this.logger.error(`Wish ${attribution.reservationWishId.uuid} not found`);
        continue;
      }

      const existingReservation = await this.reservationRepository.findByPackAndDate(
        attribution.assignedPackId,
        startingDate,
        endingDate,
      );

      if (existingReservation) {
        this.logger.error(
          `Reservation already exists for pack ${attribution.assignedPackId.uuid} on ${startingDate.value.toISOString()}`,
        );
        continue;
      }

      await this.reservationRepository.create({
        packId: attribution.assignedPackId,
        userId: wish.createdBy.id,
        startingDate,
        endingDate,
        reservationWishId: wish.id,
        publicComment: wish.publicComment,
      });

      await this.reservationWishRepository.confirmReservationWish(wish.id);

      this.logger.log(
        `Created reservation for wish ${wish.id.uuid} with pack ${attribution.assignedPackId.uuid}`,
      );
    }
  }

  private async refuseUnattributedWishes(
    attributions: Attribution[],
    pendingWishes: ReservationWishSummary[],
  ): Promise<void> {
    const confirmedWishIds = new Set(attributions.map((a) => a.reservationWishId.uuid));

    for (const wish of pendingWishes) {
      if (!confirmedWishIds.has(wish.id.uuid)) {
        await this.reservationWishRepository.refuseReservationWish(wish.id);
        this.logger.log(`Refused reservation wish ${wish.id.uuid} (no pack available)`);
      }
    }
  }
}
