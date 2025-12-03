import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { MaintenanceModeGuard } from '@libs/guards/maintenance-mode.guard';
import { UpdateReservationWishCommand } from '@modules/reservation/application/commands/update-reservation-wish/update-reservation-wish.command';
import { UpdateReservationWishService } from '@modules/reservation/application/commands/update-reservation-wish/update-reservation-wish.service';
import { ReservationWishRepositoryPort } from '@modules/reservation/domain/ports/reservation-wish.repository.port';
import {
  CannotUpdateReservationWishStatusException,
  ReservationWishNotFoundException,
} from '@modules/reservation/domain/reservation-wish.exceptions';
import { ReservationWishStatus } from '@modules/reservation/domain/reservation-wish.types';
import { RESERVATION_WISH_REPOSITORY } from '@modules/reservation/reservation.di-tokens';
import {
  Controller,
  Logger,
  UseGuards,
  Delete,
  Param,
  BadRequestException,
  NotFoundException,
  Request,
  Inject,
  ForbiddenException,
} from '@nestjs/common';

@Controller('reservation-wishes')
@UseGuards(JwtAuthGuard, MaintenanceModeGuard)
export class UpdateReservationWishHttpController {
  private readonly logger = new Logger(UpdateReservationWishHttpController.name);

  constructor(
    private readonly updateReservationWishService: UpdateReservationWishService,
    @Inject(RESERVATION_WISH_REPOSITORY)
    private readonly reservationWishRepository: ReservationWishRepositoryPort,
  ) {}

  @Delete(':id')
  async cancelReservationWish(
    @Param('id') id: string,
    @Request() { user: { id: userId } }: { user: AuthenticatedUser },
  ) {
    const command = new UpdateReservationWishCommand({
      reservationWishId: new UUID({ uuid: id }),
      userId,
      status: ReservationWishStatus.CANCELLED,
      metadata: {
        userId: userId.uuid,
      },
    });

    try {
      await this.checkUserIsAllowedToUpdateReservationWish(userId, command.reservationWishId);
      await this.updateReservationWishService.execute(command);

      return { message: 'Reservation wish cancelled' };
    } catch (error) {
      this.logger.error('Error cancelling reservation wish', error);

      if (error instanceof ReservationWishNotFoundException) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof CannotUpdateReservationWishStatusException) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  private async checkUserIsAllowedToUpdateReservationWish(
    userId: UUID,
    reservationWishId: UUID,
  ): Promise<void> {
    const reservationWish = await this.reservationWishRepository.findById(reservationWishId);

    if (reservationWish && reservationWish.userId.equals(userId)) {
      return;
    }

    throw new ForbiddenException('User is not allowed to update this reservation wish');
  }
}
