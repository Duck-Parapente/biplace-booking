import { DateValueObject } from '@libs/ddd/date.value-object';
import { GetPacksService } from '@modules/pack/commands/get-packs.service';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { PlanningDomainService } from '../domain/planning.domain-service';
import { ReservationWishRepositoryPort } from '../domain/ports/reservation-wish.repository.port';
import { ReservationRepositoryPort } from '../domain/ports/reservation.repository.port';
import { PlanningData } from '../domain/reservation.types';
import { RESERVATION_REPOSITORY, RESERVATION_WISH_REPOSITORY } from '../reservation.di-tokens';

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
      this.reservationRepository.findReservationsByDateRange(startDate, endDate),
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
