import { DateValueObject } from '@libs/ddd/date.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { GetPlanningService } from '@modules/reservation/application/queries/get-planning/get-planning.service';
import { Controller, Logger, Get, Query, UseGuards } from '@nestjs/common';
import { PlanningDayDto } from 'shared';

import { mapPlanningDataToDto } from '../mappers/reservation.mapper';

@Controller('planning')
@UseGuards(JwtAuthGuard)
export class GetPlanningHttpController {
  private readonly logger = new Logger(GetPlanningHttpController.name);

  constructor(private readonly getPlanningService: GetPlanningService) {}

  @Get()
  async getPlanning(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<PlanningDayDto[]> {
    const start = DateValueObject.fromDateString(startDate).startOfDayInUTC(0);
    const end = DateValueObject.fromDateString(endDate).startOfDayInUTC(1);

    const planningData = await this.getPlanningService.execute(start, end);
    return mapPlanningDataToDto(planningData);
  }
}
