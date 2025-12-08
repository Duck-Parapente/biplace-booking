import { Integer } from '@libs/ddd/integer.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { MaintenanceModeGuard } from '@libs/guards/maintenance-mode.guard';
import { CloseReservationCommand } from '@modules/reservation/application/commands/close-reservation/close-reservation.command';
import { CloseReservationService } from '@modules/reservation/application/commands/close-reservation/close-reservation.service';
import { ReservationAuthorizationService } from '@modules/reservation/application/services/reservation-authorization.service';
import { ReservationRepositoryPort } from '@modules/reservation/domain/ports/reservation.repository.port';
import {
  CannotCloseReservationException,
  ReservationNotFoundException,
} from '@modules/reservation/domain/reservation.exceptions';
import { RESERVATION_REPOSITORY } from '@modules/reservation/reservation.di-tokens';
import {
  Controller,
  Logger,
  UseGuards,
  Post,
  Param,
  NotFoundException,
  Request,
  Inject,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { CloseReservationDto } from 'shared';

@Controller('reservations')
@UseGuards(JwtAuthGuard, MaintenanceModeGuard)
export class CloseReservationHttpController {
  private readonly logger = new Logger(CloseReservationHttpController.name);

  constructor(
    private readonly closeReservationService: CloseReservationService,
    private readonly reservationAuthorizationService: ReservationAuthorizationService,
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  @Post(':id/close')
  async closeReservation(
    @Param('id') id: string,
    @Request() { user: { id: userId, roles } }: { user: AuthenticatedUser },
    @Body() { flightTimeMinutes, flightsCount, publicComment, privateComment }: CloseReservationDto,
  ) {
    const reservationId = new UUID({ uuid: id });
    const reservation = await this.reservationRepository.findById(reservationId);

    if (!reservation) {
      throw new NotFoundException(`Reservation not found: ${id}`);
    }

    await this.reservationAuthorizationService.checkUserIsAllowedToModifyReservation(
      reservation,
      userId,
      roles,
    );

    const command = new CloseReservationCommand({
      reservation,
      flightLog: {
        flightTimeMinutes: new Integer({ value: flightTimeMinutes }),
        flightsCount: new Integer({ value: flightsCount }),
        publicComment,
        privateComment,
      },
      metadata: {
        userId: userId.uuid,
      },
    });

    try {
      await this.closeReservationService.execute(command);

      return { message: 'Reservation closed' };
    } catch (error) {
      this.logger.error('Error closing reservation', error);

      if (error instanceof ReservationNotFoundException) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof CannotCloseReservationException) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
