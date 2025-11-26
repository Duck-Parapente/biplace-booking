import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { MaintenanceModeGuard } from '@libs/guards/maintenance-mode.guard';
import {
  Controller,
  Post,
  Body,
  Logger,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { CreateReservationWishDto } from 'shared';

import { UserHasReservationWishOnStartingDateError } from '../domain/reservation-wish.exceptions';

import { CreateReservationWishCommand } from './create-reservation-wish.command';
import { CreateReservationWishService } from './create-reservation-wish.service';

@Controller('reservation-wishes')
@UseGuards(JwtAuthGuard, MaintenanceModeGuard)
export class CreateReservationWishHttpController {
  private readonly logger = new Logger(CreateReservationWishHttpController.name);

  constructor(private readonly createReservationWishService: CreateReservationWishService) {}

  @Post()
  async createReservationWish(
    @Request() { user: { id: createdById } }: { user: AuthenticatedUser },
    @Body() { startingDate, packChoices, publicComment }: CreateReservationWishDto,
  ) {
    const command = new CreateReservationWishCommand({
      reservationWish: {
        startingDate: DateValueObject.fromDateString(startingDate),
        packChoices: packChoices.map((uuid) => new UUID({ uuid })),
        publicComment,
        createdById,
      },
      metadata: {
        userId: createdById.uuid,
      },
    });

    try {
      await this.createReservationWishService.execute(command);

      return { message: 'Reservation wish created' };
    } catch (error) {
      if (error instanceof UserHasReservationWishOnStartingDateError) {
        throw new BadRequestException(error.message);
      }

      this.logger.error('Error creating reservation wish', error);
      throw error;
    }
  }
}
