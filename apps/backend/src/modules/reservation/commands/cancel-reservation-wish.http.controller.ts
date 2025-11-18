import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import {
  Controller,
  Logger,
  UseGuards,
  Delete,
  Param,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import {
  CannotCancelConfirmedReservationWishError,
  ReservationWishNotFoundError,
} from '../domain/reservation.exceptions';

import { CancelReservationWishCommand } from './cancel-reservation-wish.command';
import { CancelReservationWishService } from './cancel-reservation-wish.service';

@Controller('reservation-wishes')
@UseGuards(JwtAuthGuard)
export class CancelReservationWishHttpController {
  private readonly logger = new Logger(CancelReservationWishHttpController.name);

  constructor(private readonly cancelReservationWishService: CancelReservationWishService) {}

  @Delete(':id')
  async createReservationWish(@Param('id') id: string) {
    const command = new CancelReservationWishCommand({
      reservationWishId: new UUID({ uuid: id }),
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

      this.logger.error('Error cancelling reservation wish', error);
      throw error;
    }
  }
}
