import { Integer } from '@libs/ddd/integer.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { MaintenanceModeGuard } from '@libs/guards/maintenance-mode.guard';
import { Roles } from '@libs/guards/roles.decorator';
import { RolesGuard } from '@libs/guards/roles.guard';
import { UpdateReservationCommand } from '@modules/reservation/application/commands/update-reservation/update-reservation.command';
import { UpdateReservationService } from '@modules/reservation/application/commands/update-reservation/update-reservation.service';
import { ReservationRepositoryPort } from '@modules/reservation/domain/ports/reservation.repository.port';
import { ReservationNotFoundException } from '@modules/reservation/domain/reservation.exceptions';
import { RESERVATION_REPOSITORY } from '@modules/reservation/reservation.di-tokens';
import {
  Controller,
  Logger,
  UseGuards,
  Patch,
  Param,
  NotFoundException,
  Request,
  Inject,
  Body,
} from '@nestjs/common';
import { UpdateReservationDto, UserRoles } from 'shared';

@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard, MaintenanceModeGuard)
@Roles(UserRoles.ADMIN)
export class UpdateReservationHttpController {
  private readonly logger = new Logger(UpdateReservationHttpController.name);

  constructor(
    private readonly updateReservationService: UpdateReservationService,
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  @Patch(':id')
  async updateReservation(
    @Param('id') id: string,
    @Request() { user: { id: userId } }: { user: AuthenticatedUser },
    @Body() { cost }: UpdateReservationDto,
  ) {
    const reservationId = new UUID({ uuid: id });
    const reservation = await this.reservationRepository.findById(reservationId);

    if (!reservation) {
      throw new NotFoundException(`Reservation not found: ${id}`);
    }

    const command = new UpdateReservationCommand({
      reservation,
      cost: new Integer({ value: cost }),
      metadata: {
        userId,
      },
    });

    try {
      await this.updateReservationService.execute(command);

      return { message: 'Reservation updated successfully' };
    } catch (error) {
      this.logger.error('Error updating reservation', error);

      if (error instanceof ReservationNotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
