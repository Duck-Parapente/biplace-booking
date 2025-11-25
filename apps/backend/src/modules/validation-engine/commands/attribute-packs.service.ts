import { DateValueObject } from '@libs/ddd/date.value-object';
import { ReservationWishSummary } from '@libs/types/accross-modules';
import { GetPacksService } from '@modules/pack/commands/get-packs.service';
import { CreateReservationsService } from '@modules/reservation/commands/create-reservation.service';
import { GetReservationWishesService } from '@modules/reservation/commands/get-reservation-wishes.service';
import { UpdateReservationWishService } from '@modules/reservation/commands/update-reservation-wish.service';
import { Injectable, Logger } from '@nestjs/common';

import { AttributionDomainService } from '../domain/attribution.domain-service';
import { Attribution, VALIDATION_ENGINE_MODULE } from '../domain/validation-engine.types';

@Injectable()
export class AttributePacksService {
  private readonly logger = new Logger(AttributePacksService.name);
  private readonly ATTRIBUTION_START_DAY_OFFSET = 1;
  private readonly ATTRIBUTION_END_DAY_OFFSET = 5;

  constructor(
    private readonly getPacksService: GetPacksService,
    private readonly getReservationWishesService: GetReservationWishesService,
    private readonly updateReservationWishService: UpdateReservationWishService,
    private readonly createReservationsService: CreateReservationsService,
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

      this.logger.warn(`Will process attributions for ${startingDate.value.toISOString()}`);

      try {
        await this.processAttributionsForDate(startingDate, endingDate);
      } catch (error) {
        this.logger.error(
          `Error processing attributions for ${startingDate.value.toISOString()}: ${
            (error as Error).message
          }`,
        );
      }
    }
  }

  private async processAttributionsForDate(
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<void> {
    const pendingWishes =
      await this.getReservationWishesService.findPendingAndRefusedByStartingDate(startingDate);

    if (pendingWishes.length === 0) {
      this.logger.log(`No pending wishes for ${startingDate.value.toISOString()}`);
      return;
    }

    const availablePacks = await this.getPacksService.findAvailablePacks(startingDate, endingDate);

    if (availablePacks.length === 0) {
      this.logger.log(`No available packs for ${startingDate.value.toISOString()}`);
      return;
    }

    this.logger.log(
      `👤 Found ${pendingWishes.length} pending wishes: ${pendingWishes
        .map(
          ({ createdBy: { nickname }, packChoices }) =>
            `${nickname} (choices: [${packChoices.map((c) => c.label).join(', ')}])`,
        )
        .join(', ')}`,
    );

    this.logger.log(
      `🪂 Found ${availablePacks.length} available packs: ${availablePacks
        .map(({ label }) => label)
        .join(', ')}`,
    );

    const attributions = await this.attributionDomainService.getAttributions({
      availablePacks,
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

      await this.createReservationsService.create(
        {
          packId: attribution.assignedPackId,
          userId: wish.createdBy.id,
          startingDate,
          endingDate,
          reservationWishId: wish.id,
          publicComment: wish.publicComment,
        },
        VALIDATION_ENGINE_MODULE,
      );

      await this.updateReservationWishService.confirmReservationWish(
        wish.id,
        VALIDATION_ENGINE_MODULE,
      );

      this.logger.log(
        `✅ Created reservation for wish ${wish.id.uuid} with pack ${attribution.assignedPackId.uuid}`,
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
        await this.updateReservationWishService.refuseReservationWish(
          wish.id,
          VALIDATION_ENGINE_MODULE,
        );
        this.logger.log(`Refused reservation wish ${wish.id.uuid} (no pack available)`);
      }
    }
  }
}
