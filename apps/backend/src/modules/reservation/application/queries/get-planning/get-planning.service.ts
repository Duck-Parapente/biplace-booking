import { DateValueObject } from '@libs/ddd/date.value-object';
import { GetPacksService } from '@modules/pack/application/queries/get-packs/get-packs.service';
import { PlanningDomainService } from '@modules/reservation/domain/planning.domain-service';
import { ReservationWishRepositoryPort } from '@modules/reservation/domain/ports/reservation-wish.repository.port';
import { ReservationRepositoryPort } from '@modules/reservation/domain/ports/reservation.repository.port';
import { PlanningData } from '@modules/reservation/domain/reservation.types';
import {
  RESERVATION_REPOSITORY,
  RESERVATION_WISH_REPOSITORY,
} from '@modules/reservation/reservation.di-tokens';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GetPlanningService {
  private readonly logger = new Logger(GetPlanningService.name);

  constructor(
    @Inject(RESERVATION_REPOSITORY)
    protected readonly reservationRepository: ReservationRepositoryPort,
    @Inject(RESERVATION_WISH_REPOSITORY)
    protected readonly reservationWishRepository: ReservationWishRepositoryPort,
    private readonly planningDomainService: PlanningDomainService,
    private readonly getPacksService: GetPacksService,
  ) {}

  async execute(startDate: DateValueObject, endDate: DateValueObject): Promise<PlanningData[]> {
    const [packs, reservations, pendingWishes] = await Promise.all([
      this.getPacksService.execute(),
      this.reservationRepository.findConfirmedReservationsByDateRange(startDate, endDate),
      this.reservationWishRepository.findPendingWishesByDateRange(startDate, endDate),
    ]);

    return this.planningDomainService.buildPlanningData(
      startDate,
      endDate,
      packs,
      reservations,
      pendingWishes,
    );
  }
}
