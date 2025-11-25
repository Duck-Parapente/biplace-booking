import { DomainEventMetadata } from '@libs/ddd';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { ReservationRepositoryPort } from '../domain/ports/reservation.repository.port';
import { ReservationDomainService } from '../domain/reservation.domain-service';
import { ReservationEntity } from '../domain/reservation.entity';
import { CreateReservationProps } from '../domain/reservation.types';
import { RESERVATION_REPOSITORY } from '../reservation.di-tokens';

@Injectable()
export class CreateReservationsService {
  private readonly logger = new Logger(CreateReservationsService.name);

  constructor(
    @Inject(RESERVATION_REPOSITORY)
    protected readonly reservationRepository: ReservationRepositoryPort,
    protected readonly reservationDomainService: ReservationDomainService,
  ) {}

  async create(props: CreateReservationProps, metadata: DomainEventMetadata): Promise<void> {
    await this.reservationDomainService.validateCreateReservationWish(props);
    const entity = ReservationEntity.create(props, metadata);
    await this.reservationRepository.create(entity);
  }
}
