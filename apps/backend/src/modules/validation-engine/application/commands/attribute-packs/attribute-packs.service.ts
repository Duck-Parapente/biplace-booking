import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { EventEmitterPort } from '@libs/events/domain/event-emitter.port';
import { ReservationWishForAttribution } from '@libs/types/accross-modules';
import { GetPacksService } from '@modules/pack/application/queries/get-packs/get-packs.service';
import { CreateReservationCommand } from '@modules/reservation/application/commands/create-reservation/create-reservation.command';
import { CreateReservationsService } from '@modules/reservation/application/commands/create-reservation/create-reservation.service';
import { UpdateReservationWishService } from '@modules/reservation/application/commands/update-reservation-wish/update-reservation-wish.service';
import { GetReservationWishesService } from '@modules/reservation/application/queries/get-reservation-wishes/get-reservation-wishes.service';
import { AttributionDomainService } from '@modules/validation-engine/domain/attribution.domain-service';
import { ValidationEngineRunDomainEvent } from '@modules/validation-engine/domain/events/validation-engine-run.domain-event';
import {
  Attribution,
  VALIDATION_ENGINE_MODULE,
} from '@modules/validation-engine/domain/validation-engine.types';
import { Inject, Injectable, Logger } from '@nestjs/common';

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
    @Inject(EVENT_EMITTER)
    private readonly eventEmitter: EventEmitterPort,
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
    const availablePacks = await this.getPacksService.findAvailablePacks(startingDate, endingDate);

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

    const engineInput = {
      availablePacks,
      reservationWishes: pendingWishes,
    };

    const attributions = this.attributionDomainService.getAttributions(engineInput);

    this.logger.log(`Generated ${attributions.length} attributions`);

    await this.createReservations(attributions, pendingWishes, startingDate, endingDate);

    await this.refuseUnattributedWishes(attributions, pendingWishes);

    await this.eventEmitter.logDomainEvent(
      new ValidationEngineRunDomainEvent({
        aggregateId: UUID.random(),
        engineInput,
        attributions,
        startingDate,
        endingDate,
      }),
    );
  }

  private async createReservations(
    attributions: Attribution[],
    pendingWishes: ReservationWishForAttribution[],
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<void> {
    for (const attribution of attributions) {
      const wish = pendingWishes.find((w) => w.id.equals(attribution.reservationWishId));
      if (!wish) {
        this.logger.error(`Wish ${attribution.reservationWishId.uuid} not found`);
        continue;
      }

      await this.createReservationsService.execute(
        new CreateReservationCommand({
          reservation: {
            packId: attribution.assignedPackId,
            userId: wish.createdBy.id,
            startingDate,
            endingDate,
            reservationWishId: wish.id,
            publicComment: wish.publicComment,
          },
          metadata: VALIDATION_ENGINE_MODULE,
        }),
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
    pendingWishes: ReservationWishForAttribution[],
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
