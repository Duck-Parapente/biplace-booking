import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { EventEmitterPort } from '@libs/events/domain/event-emitter.port';
import { ReservationWishForAttribution } from '@libs/types/accross-modules';
import { GetPacksService } from '@modules/pack/application/queries/get-packs/get-packs.service';
import { CreateReservationCommand } from '@modules/reservation/application/commands/create-reservation/create-reservation.command';
import { CreateReservationService } from '@modules/reservation/application/commands/create-reservation/create-reservation.service';
import { UpdateReservationWishService } from '@modules/reservation/application/commands/update-reservation-wish/update-reservation-wish.service';
import { GetReservationsService } from '@modules/reservation/application/queries/get-reservation/get-reservation.service';
import { GetReservationWishesService } from '@modules/reservation/application/queries/get-reservation-wishes/get-reservation-wishes.service';
import { AttributionExplanationHtmlDomainService } from '@modules/validation-engine/domain/attribution-explanation-html.domain-service';
import { AttributionDomainService } from '@modules/validation-engine/domain/attribution.domain-service';
import { ValidationEngineRunDomainEvent } from '@modules/validation-engine/domain/events/validation-engine-run.domain-event';
import {
  Attribution,
  BaseValidationEngineProps,
  EnginePack,
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
    private readonly getReservationsService: GetReservationsService,
    private readonly getReservationWishesService: GetReservationWishesService,
    private readonly updateReservationWishService: UpdateReservationWishService,
    private readonly createReservationService: CreateReservationService,
    private readonly attributionDomainService: AttributionDomainService,
    private readonly attributionExplanationHtmlDomainService: AttributionExplanationHtmlDomainService,
    @Inject(EVENT_EMITTER)
    private readonly eventEmitter: EventEmitterPort,
  ) {}

  async attributePacks(): Promise<void> {
    const todayNormalized = DateValueObject.now();
    const errors: Array<{ date: string; error: Error }> = [];
    const allPacks = await this.getPacksService.execute();

    for (
      let dayOffset = this.ATTRIBUTION_START_DAY_OFFSET;
      dayOffset <= this.ATTRIBUTION_END_DAY_OFFSET;
      dayOffset++
    ) {
      const startingDate = todayNormalized.startOfDayInUTC(dayOffset);
      const endingDate = startingDate.startOfDayInUTC(1);

      this.logger.warn(`Will process attributions for ${startingDate.value.toISOString()}`);

      try {
        await this.processAttributionsForDate(startingDate, endingDate, allPacks);
      } catch (error) {
        const errorMessage = `Error processing attributions for ${startingDate.value.toISOString()}: ${
          (error as Error).message
        }`;
        this.logger.error(errorMessage);
        errors.push({ date: startingDate.value.toISOString(), error: error as Error });
      }
    }

    if (!errors.length) {
      this.logger.log('Attribution process completed successfully without errors.');
      return;
    }

    const errorSummary = errors.map(({ date, error }) => `${date}: ${error.message}`).join('\n');
    throw new Error(
      `Attribution process completed with ${errors.length} error(s):\n${errorSummary}`,
    );
  }

  private async processAttributionsForDate(
    startingDate: DateValueObject,
    endingDate: DateValueObject,
    allPacks: EnginePack[],
  ): Promise<void> {
    const pendingWishes =
      await this.getReservationWishesService.findPendingAndRefusedByStartingDate(startingDate);
    const availablePacks = await this.getReservationsService.findAvailablePacks(
      startingDate,
      endingDate,
    );

    this.logger.log(
      `👤 Found ${pendingWishes.length} pending wishes: ${pendingWishes
        .map(
          ({ user: { nickname }, packChoices }) =>
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
    await this.refuseUnattributedWishes(allPacks, engineInput, attributions);

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

      await this.createReservationService.execute(
        new CreateReservationCommand({
          reservation: {
            packId: attribution.assignedPackId,
            userId: wish.user.id,
            startingDate,
            endingDate,
            reservationWishId: wish.id,
            publicComment: wish.publicComment,
          },
          metadata: VALIDATION_ENGINE_MODULE,
        }),
      );

      this.logger.log(
        `✅ Created reservation for wish ${wish.id.uuid} with pack ${attribution.assignedPackId.uuid}`,
      );
    }
  }

  private async refuseUnattributedWishes(
    allPacks: EnginePack[],
    engineInput: BaseValidationEngineProps,
    attributions: Attribution[],
  ): Promise<void> {
    const attributedWishIds = new Set(attributions.map((a) => a.reservationWishId.uuid));
    const refusedWishes = engineInput.reservationWishes.filter(
      (wish) => !attributedWishIds.has(wish.id.uuid),
    );

    if (refusedWishes.length === 0) {
      return;
    }

    const explanationTable = this.attributionExplanationHtmlDomainService.generateHtmlTable(
      allPacks,
      engineInput,
      attributions,
    );

    for (const wish of refusedWishes) {
      await this.updateReservationWishService.refuseReservationWish(
        wish.id,
        explanationTable,
        VALIDATION_ENGINE_MODULE,
      );
    }
  }
}
