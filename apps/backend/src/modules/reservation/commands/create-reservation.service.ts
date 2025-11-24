import { Inject, Injectable, Logger } from '@nestjs/common';

import { ReservationRepositoryPort } from '../domain/ports/reservation.repository.port';
import { ReservationEntity } from '../domain/reservation.entity';
import { CreateReservationProps } from '../domain/reservation.types';
import { RESERVATION_REPOSITORY } from '../reservation.di-tokens';

@Injectable()
export class CreateReservationsService {
  private readonly logger = new Logger(CreateReservationsService.name);

  constructor(
    @Inject(RESERVATION_REPOSITORY)
    protected readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  async create(props: CreateReservationProps): Promise<void> {
    const entity = ReservationEntity.create(props);
    await this.reservationRepository.create(entity);
  }
}
