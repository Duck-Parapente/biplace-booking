import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { MaintenanceModeGuard } from '@libs/guards/maintenance-mode.guard';
import { Roles } from '@libs/guards/roles.decorator';
import { RolesGuard } from '@libs/guards/roles.guard';
import { CreateReservationCommand } from '@modules/reservation/application/commands/create-reservation/create-reservation.command';
import { CreateReservationsService } from '@modules/reservation/application/commands/create-reservation/create-reservation.service';
import { CannotCreateReservationError } from '@modules/reservation/domain/reservation.exceptions';
import {
  Controller,
  Post,
  Body,
  Logger,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { CreateReservationDto, UserRoles } from 'shared';

@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard, MaintenanceModeGuard)
@Roles(UserRoles.ADMIN)
export class CreateReservationHttpController {
  private readonly logger = new Logger(CreateReservationHttpController.name);

  constructor(private readonly createReservationService: CreateReservationsService) {}

  @Post()
  async createReservationWish(
    @Request() { user: { id: createdById } }: { user: AuthenticatedUser },
    @Body() { startingDate, packId, userId, publicComment }: CreateReservationDto,
  ) {
    const command = new CreateReservationCommand({
      reservation: {
        packId: new UUID({ uuid: packId }),
        userId: new UUID({ uuid: userId }),
        startingDate: DateValueObject.fromDateString(startingDate).startOfDayInUTC(0),
        endingDate: DateValueObject.fromDateString(startingDate).startOfDayInUTC(1),
        publicComment: publicComment,
      },
      metadata: { userId: createdById.uuid },
    });

    try {
      await this.createReservationService.execute(command);

      return { message: 'Reservation created' };
    } catch (error) {
      this.logger.error('Error creating reservation', error);
      if (error instanceof CannotCreateReservationError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
