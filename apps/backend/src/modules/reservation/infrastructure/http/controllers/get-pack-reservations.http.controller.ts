import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { GetPackReservationsService } from '@modules/reservation/application/queries/get-pack-reservations/get-pack-reservations.service';
import { Controller, Logger, Get, Query, UseGuards } from '@nestjs/common';
import { PackReservationsDto } from 'shared';

import { mapPackReservationsToDto } from '../mappers/reservation.mapper';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class GetPackReservationsHttpController {
  private readonly logger = new Logger(GetPackReservationsHttpController.name);

  constructor(private readonly getPackReservationsService: GetPackReservationsService) {}

  @Get('pack')
  async getPackReservations(@Query('packId') packId: string): Promise<PackReservationsDto> {
    const reservations = await this.getPackReservationsService.execute(new UUID({ uuid: packId }));
    return mapPackReservationsToDto(reservations);
  }
}
