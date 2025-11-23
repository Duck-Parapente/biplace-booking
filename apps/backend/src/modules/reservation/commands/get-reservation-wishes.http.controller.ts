import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { Controller, Logger, Get, UseGuards, Request } from '@nestjs/common';
import { ReservationWishDto } from 'shared';

import { GetReservationWishesService } from './get-reservation-wishes.service';
import { mapReservationWishToDto } from './reservation.mapper';

@Controller('reservation-wishes')
export class GetReservationWishesHttpController {
  private readonly logger = new Logger(GetReservationWishesHttpController.name);

  constructor(private readonly getReservationWishesService: GetReservationWishesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getReservationWishes(
    @Request() { user: { id } }: { user: AuthenticatedUser },
  ): Promise<ReservationWishDto[]> {
    const reservationWishes = await this.getReservationWishesService.execute(id);
    return reservationWishes.map(mapReservationWishToDto);
  }
}
