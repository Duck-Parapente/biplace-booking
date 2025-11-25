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
  CannotUpdateReservationWishStatusError,
  ReservationWishNotFoundError,
  UnauthorizedToCancelReservationWishError,
} from '../domain/reservation.exceptions';
import { ReservationWishStatus } from '../domain/reservation.types';

import { UpdateReservationWishCommand } from './update-reservation-wish.command';
import { UpdateReservationWishService } from './update-reservation-wish.service';

@Controller('reservation-wishes')
@UseGuards(JwtAuthGuard)
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
      if (error instanceof ReservationWishNotFoundError) {
        this.logger.warn(`Reservation wish not found: ${error.message}`);
        throw new NotFoundException(error.message);
      }

      if (error instanceof CannotUpdateReservationWishStatusError) {
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
