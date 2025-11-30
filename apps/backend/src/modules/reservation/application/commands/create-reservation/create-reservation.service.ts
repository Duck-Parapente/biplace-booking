import { DomainEventMetadata } from '@libs/ddd';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { ReservationRepositoryPort } from '@modules/reservation/domain/ports/reservation.repository.port';
import { ReservationDomainService } from '@modules/reservation/domain/reservation.domain-service';
import { ReservationEntity } from '@modules/reservation/domain/reservation.entity';
import { RESERVATION_REPOSITORY } from '@modules/reservation/reservation.di-tokens';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { GetReservationWishesService } from '../../queries/get-reservation-wishes/get-reservation-wishes.service';
import { UpdateReservationWishService } from '../update-reservation-wish/update-reservation-wish.service';

import { CreateReservationCommand } from './create-reservation.command';

@Injectable()
export class CreateReservationsService {
  private readonly logger = new Logger(CreateReservationsService.name);

  constructor(
    @Inject(RESERVATION_REPOSITORY)
    protected readonly reservationRepository: ReservationRepositoryPort,
    protected readonly reservationDomainService: ReservationDomainService,
    protected readonly updateReservationWishService: UpdateReservationWishService,
    protected readonly getReservationWishesService: GetReservationWishesService,
  ) {}

  async execute({ reservation, metadata }: CreateReservationCommand): Promise<void> {
    await this.reservationDomainService.validateCreateReservationWish(reservation);
    const entity = ReservationEntity.create(reservation, metadata);
    await this.reservationRepository.create(entity);
    await this.updateReservationWishService.confirmReservationWish(
      reservation.reservationWishId,
      metadata,
    );
    await this.refuseUnattributedWishes(reservation.startingDate, metadata);
  }

  private async refuseUnattributedWishes(
    startingDate: DateValueObject,
    metadata: DomainEventMetadata,
  ): Promise<void> {
    const pendingWishes =
      await this.getReservationWishesService.findPendingAndRefusedByStartingDate(startingDate);

    for (const wish of pendingWishes) {
      await this.updateReservationWishService.refuseReservationWish(wish.id, metadata);
    }
  }
}
