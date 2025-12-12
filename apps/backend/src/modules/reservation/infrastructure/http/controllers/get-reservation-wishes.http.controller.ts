import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { GetReservationWishesService } from '@modules/reservation/application/queries/get-reservation-wishes/get-reservation-wishes.service';
import { Controller, Logger, Get, UseGuards, Request } from '@nestjs/common';
import { ReservationWishDto } from 'shared';

import { mapReservationWishWithHistoryToDto } from '../mappers/reservation-history.mapper';

@Controller('reservation-wishes')
@UseGuards(JwtAuthGuard)
export class GetReservationWishesHttpController {
  private readonly logger = new Logger(GetReservationWishesHttpController.name);

  constructor(private readonly getReservationWishesService: GetReservationWishesService) {}

  @Get()
  async getReservationWishes(
    @Request() { user: { id } }: { user: AuthenticatedUser },
  ): Promise<ReservationWishDto[]> {
    const reservationWishes = await this.getReservationWishesService.execute(id);
    return reservationWishes.map(mapReservationWishWithHistoryToDto);
  }
}
