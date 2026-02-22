import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { Roles } from '@libs/guards/roles.decorator';
import { RolesGuard } from '@libs/guards/roles.guard';
import { GetReservationWishesService } from '@modules/reservation/application/queries/get-reservation-wishes/get-reservation-wishes.service';
import { Controller, Logger, Get, UseGuards, Request } from '@nestjs/common';
import { ReservationWishDto, UserRoles } from 'shared';

import { mapReservationWishWithHistoryToDto } from '../mappers/reservation-history.mapper';

@Controller('reservation-wishes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoles.USER)
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
