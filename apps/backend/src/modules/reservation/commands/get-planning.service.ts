import { DateValueObject } from '@libs/ddd/date.value-object';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { ReservationRepositoryPort } from '../domain/ports/reservation.repository.port';
import { PlanningData } from '../domain/reservation.types';
import { RESERVATION_REPOSITORY } from '../reservation.di-tokens';

@Injectable()
export class GetPlanningService {
  private readonly logger = new Logger(GetPlanningService.name);

  constructor(
    @Inject(RESERVATION_REPOSITORY)
    protected readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  async execute(startDate: DateValueObject, endDate: DateValueObject): Promise<PlanningData[]> {
    return this.reservationRepository.findPlanningData(startDate, endDate);
  }
}
