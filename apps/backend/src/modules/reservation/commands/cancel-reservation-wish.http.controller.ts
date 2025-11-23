import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
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

import {
  CannotCancelConfirmedReservationWishError,
  ReservationWishNotFoundError,
  UnauthorizedToCancelReservationWishError,
} from '../domain/reservation.exceptions';

import { CancelReservationWishCommand } from './cancel-reservation-wish.command';
import { CancelReservationWishService } from './cancel-reservation-wish.service';

@Controller('reservation-wishes')
@UseGuards(JwtAuthGuard)
export class CancelReservationWishHttpController {
  private readonly logger = new Logger(CancelReservationWishHttpController.name);

  constructor(private readonly cancelReservationWishService: CancelReservationWishService) {}

  @Delete(':id')
  async createReservationWish(
    @Param('id') id: string,
    @Request() { user: { id: userId } }: { user: AuthenticatedUser },
  ) {
    const command = new CancelReservationWishCommand({
      reservationWishId: new UUID({ uuid: id }),
      userId,
    });

    try {
      await this.cancelReservationWishService.execute(command);

      return { message: 'Reservation wish cancelled' };
    } catch (error) {
      if (error instanceof ReservationWishNotFoundError) {
        this.logger.warn(`Reservation wish not found: ${error.message}`);
        throw new NotFoundException(error.message);
      }

      if (error instanceof CannotCancelConfirmedReservationWishError) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof UnauthorizedToCancelReservationWishError) {
        this.logger.warn(`Unauthorized cancellation attempt: ${error.message}`);
        throw new NotFoundException('Reservation wish not found');
      }

      this.logger.error('Error cancelling reservation wish', error);
      throw error;
    }
  }
}
