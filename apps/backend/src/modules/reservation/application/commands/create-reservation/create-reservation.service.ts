import { DomainEventMetadata } from '@libs/ddd';
import { ReservationRepositoryPort } from '@modules/reservation/domain/ports/reservation.repository.port';
import { ReservationDomainService } from '@modules/reservation/domain/reservation.domain-service';
import { ReservationEntity } from '@modules/reservation/domain/reservation.entity';
import { CreateReservationProps } from '@modules/reservation/domain/reservation.types';
import { RESERVATION_REPOSITORY } from '@modules/reservation/reservation.di-tokens';
import { Inject, Injectable, Logger } from '@nestjs/common';

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
