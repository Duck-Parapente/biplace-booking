import { ReservationRepositoryPort } from '@modules/reservation/domain/ports/reservation.repository.port';
import { ReservationDomainService } from '@modules/reservation/domain/reservation.domain-service';
import { ReservationEntity } from '@modules/reservation/domain/reservation.entity';
import { RESERVATION_REPOSITORY } from '@modules/reservation/reservation.di-tokens';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { CreateReservationCommand } from './create-reservation.command';

@Injectable()
export class CreateReservationsService {
  private readonly logger = new Logger(CreateReservationsService.name);

  constructor(
    @Inject(RESERVATION_REPOSITORY)
    protected readonly reservationRepository: ReservationRepositoryPort,
    protected readonly reservationDomainService: ReservationDomainService,
  ) {}

  async execute({ reservation, metadata }: CreateReservationCommand): Promise<void> {
    await this.reservationDomainService.validateCreateReservationWish(reservation);
    const entity = ReservationEntity.create(reservation, metadata);
    await this.reservationRepository.create(entity);
  }
}
