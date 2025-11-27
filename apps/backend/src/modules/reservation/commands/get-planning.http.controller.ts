import { DateValueObject } from '@libs/ddd/date.value-object';
import { Controller, Logger, Get, Query, UseGuards } from '@nestjs/common';
import { PlanningDayDto } from 'shared';

import { GetPlanningService } from './get-planning.service';
import { mapPlanningDataToDto } from './reservation.mapper';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';

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
    const start = DateValueObject.fromDateString(startDate);
    const end = DateValueObject.fromDateString(endDate);

    const planningData = await this.getPlanningService.execute(start, end);
    return mapPlanningDataToDto(planningData);
  }
}
