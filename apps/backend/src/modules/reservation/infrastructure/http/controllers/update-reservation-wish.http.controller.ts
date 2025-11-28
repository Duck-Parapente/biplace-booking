import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { MaintenanceModeGuard } from '@libs/guards/maintenance-mode.guard';
import { UpdateReservationWishCommand } from '@modules/reservation/application/commands/update-reservation-wish/update-reservation-wish.command';
import { UpdateReservationWishService } from '@modules/reservation/application/commands/update-reservation-wish/update-reservation-wish.service';
import {
  CannotUpdateReservationWishStatusError,
  ReservationWishNotFoundError,
  UnauthorizedToCancelReservationWishError,
} from '@modules/reservation/domain/reservation-wish.exceptions';
import { ReservationWishStatus } from '@modules/reservation/domain/reservation-wish.types';
import {
  Controller,
  Logger,
  UseGuards,
  Delete,
  Param,
  BadRequestException,
  NotFoundException,
  Request,
} from '@nestjs/common';

@Controller('reservation-wishes')
@UseGuards(JwtAuthGuard, MaintenanceModeGuard)
export class UpdateReservationWishHttpController {
  private readonly logger = new Logger(UpdateReservationWishHttpController.name);

  constructor(private readonly updateReservationWishService: UpdateReservationWishService) {}

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
      await this.updateReservationWishService.execute(command);

      return { message: 'Reservation wish cancelled' };
    } catch (error) {
      this.logger.error('Error cancelling reservation wish', error);

      if (error instanceof ReservationWishNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof CannotUpdateReservationWishStatusError) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof UnauthorizedToCancelReservationWishError) {
        throw new NotFoundException('Reservation wish not found');
      }

      throw error;
    }
  }
}
