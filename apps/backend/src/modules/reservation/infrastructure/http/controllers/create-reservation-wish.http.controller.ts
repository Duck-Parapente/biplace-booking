import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { ExceptionBase } from '@libs/exceptions';
import { ActiveUserGuard } from '@libs/guards/active-user.guard';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { MaintenanceModeGuard } from '@libs/guards/maintenance-mode.guard';
import { Roles } from '@libs/guards/roles.decorator';
import { RolesGuard } from '@libs/guards/roles.guard';
import { CreateReservationWishCommand } from '@modules/reservation/application/commands/create-reservation-wish/create-reservation-wish.command';
import { CreateReservationWishService } from '@modules/reservation/application/commands/create-reservation-wish/create-reservation-wish.service';
import {
  EmptyPackChoicesException,
  ReservationWishInvalidDateRangeException,
  UserHasReservationWishOnStartingDateException,
} from '@modules/reservation/domain/reservation-wish.exceptions';
import {
  Controller,
  Post,
  Body,
  Logger,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { CreateReservationWishDto, UserRoles } from 'shared';

@Controller('reservation-wishes')
@UseGuards(JwtAuthGuard, MaintenanceModeGuard, ActiveUserGuard, RolesGuard)
@Roles(UserRoles.USER)
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
        userId: createdById,
      },
      metadata: {
        userId: createdById,
      },
    });

    try {
      await this.createReservationWishService.execute(command);

      return { message: 'Reservation wish created' };
    } catch (error) {
      this.logger.error('Error creating reservation wish', error);
      if (
        error instanceof ExceptionBase &&
        [
          EmptyPackChoicesException.name,
          ReservationWishInvalidDateRangeException.name,
          UserHasReservationWishOnStartingDateException.name,
        ].includes(error.code)
      ) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
