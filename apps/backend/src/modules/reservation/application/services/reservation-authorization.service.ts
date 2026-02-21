import { UUID } from '@libs/ddd/uuid.value-object';
import { GetPacksService } from '@modules/pack/application/queries/get-packs/get-packs.service';
import { ReservationEntity } from '@modules/reservation/domain/reservation.entity';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserRoles } from 'shared';

@Injectable()
export class ReservationAuthorizationService {
  constructor(private readonly getPacksService: GetPacksService) {}

  async checkUserIsAllowedToCancelReservation(
    { packId, userId: reservationUserId }: ReservationEntity,
    userId: UUID,
    roles: UserRoles[],
  ): Promise<void> {
    if (await this.getPacksService.isUserAllowedToManagePack(packId, userId, roles)) {
      return;
    }

    if (reservationUserId && reservationUserId.equals(userId)) {
      return;
    }

    throw new ForbiddenException('User is not allowed to cancel this reservation');
  }

  async checkUserIsAllowedToCloseReservation(
    { packId, userId: reservationUserId }: ReservationEntity,
    userId: UUID,
    roles: UserRoles[],
  ): Promise<void> {
    if (await this.getPacksService.isUserAllowedToManagePack(packId, userId, roles)) {
      return;
    }

    if (reservationUserId && reservationUserId.equals(userId)) {
      return;
    }

    throw new ForbiddenException('User is not allowed to close this reservation');
  }

  async checkUserIsAllowedToCreateReservation(
    packId: UUID,
    userId: UUID,
    roles: UserRoles[],
  ): Promise<void> {
    if (await this.getPacksService.isUserAllowedToManagePack(packId, userId, roles)) {
      return;
    }

    throw new ForbiddenException('User is not allowed to create a reservation for this pack');
  }
}
