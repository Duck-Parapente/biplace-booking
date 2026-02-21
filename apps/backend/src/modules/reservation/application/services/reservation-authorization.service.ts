import { UUID } from '@libs/ddd/uuid.value-object';
import { GetPacksService } from '@modules/pack/application/queries/get-packs/get-packs.service';
import { ReservationEntity } from '@modules/reservation/domain/reservation.entity';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserRoles } from 'shared';

@Injectable()
export class ReservationAuthorizationService {
  constructor(private readonly getPacksService: GetPacksService) {}

  //TODO 1: change isPackOwnedByUser to isUserAllowedToManagePack and check manager role + ownership in the same method (with admin)
  //TODO 2: split modify into cancel and close methods
      // close = see canClose in ClosReservationModal
      // cancel = PlanningDayCard rule
  async checkUserIsAllowedToModifyReservation(
    { packId, userId: reservationUserId }: ReservationEntity,
    userId: UUID,
    roles: UserRoles[],
  ): Promise<void> {
    if (roles.includes(UserRoles.ADMIN)) {
      return;
    }

    if (await this.getPacksService.isPackOwnedByUser(packId, userId)) {
      return;
    }

    if (reservationUserId && reservationUserId.equals(userId)) {
      return;
    }

    throw new ForbiddenException('User is not allowed to modify this reservation');
  }

  async checkUserIsAllowedToCreateReservation(
    packId: UUID,
    userId: UUID,
    roles: UserRoles[],
  ): Promise<void> {
    if (roles.includes(UserRoles.ADMIN)) {
      return;
    }

    if (await this.getPacksService.isPackOwnedByUser(packId, userId)) {
      return;
    }

    throw new ForbiddenException('User is not allowed to create a reservation for this pack');
  }
}
