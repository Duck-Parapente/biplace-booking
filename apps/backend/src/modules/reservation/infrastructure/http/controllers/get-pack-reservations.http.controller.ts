import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { Roles } from '@libs/guards/roles.decorator';
import { RolesGuard } from '@libs/guards/roles.guard';
import { GetPackReservationsService } from '@modules/reservation/application/queries/get-pack-reservations/get-pack-reservations.service';
import { Controller, Logger, Get, Query, UseGuards } from '@nestjs/common';
import { PackReservationsDto, UserRoles } from 'shared';

import { mapPackReservationsToDto } from '../mappers/reservation.mapper';

@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoles.USER)
export class GetPackReservationsHttpController {
  private readonly logger = new Logger(GetPackReservationsHttpController.name);

  constructor(private readonly getPackReservationsService: GetPackReservationsService) {}

  @Get('pack')
  async getPackReservations(@Query('packId') packId: string): Promise<PackReservationsDto> {
    const reservations = await this.getPackReservationsService.execute(new UUID({ uuid: packId }));
    return mapPackReservationsToDto(reservations);
  }
}
