import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { MaintenanceModeGuard } from '@libs/guards/maintenance-mode.guard';
import { GetPacksService } from '@modules/pack/application/queries/get-packs/get-packs.service';
import { CancelReservationCommand } from '@modules/reservation/application/commands/cancel-reservation/cancel-reservation.command';
import { CancelReservationService } from '@modules/reservation/application/commands/cancel-reservation/cancel-reservation.service';
import { ReservationRepositoryPort } from '@modules/reservation/domain/ports/reservation.repository.port';
import {
  CannotCancelReservationError,
  ReservationNotFoundError,
} from '@modules/reservation/domain/reservation.exceptions';
import { RESERVATION_REPOSITORY } from '@modules/reservation/reservation.di-tokens';
import {
  Controller,
  Logger,
  UseGuards,
  Delete,
  Param,
  NotFoundException,
  Request,
  ForbiddenException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { UserRoles } from 'shared';

@Controller('reservations')
@UseGuards(JwtAuthGuard, MaintenanceModeGuard)
export class CancelReservationHttpController {
  private readonly logger = new Logger(CancelReservationHttpController.name);

  constructor(
    private readonly cancelReservationService: CancelReservationService,
    private readonly getPacksService: GetPacksService,
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  @Delete(':id')
  async cancelReservation(
    @Param('id') id: string,
    @Request() { user: { id: userId, roles } }: { user: AuthenticatedUser },
  ) {
    const reservationId = new UUID({ uuid: id });
    const reservation = await this.reservationRepository.findById(reservationId);

    if (!reservation) {
      throw new NotFoundException(`Reservation not found: ${id}`);
    }

    await this.checkUserIsAllowedToCancelReservation(reservation.packId, userId, roles);

    const command = new CancelReservationCommand({
      reservation,
      metadata: {
        userId: userId.uuid,
      },
    });

    try {
      await this.cancelReservationService.execute(command);

      return { message: 'Reservation cancelled' };
    } catch (error) {
      this.logger.error('Error cancelling reservation', error);

      if (error instanceof ReservationNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof CannotCancelReservationError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  private async checkUserIsAllowedToCancelReservation(
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

    throw new ForbiddenException('User is not allowed to cancel this reservation');
  }
}
