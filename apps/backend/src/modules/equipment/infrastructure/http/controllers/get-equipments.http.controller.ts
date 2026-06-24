import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { Roles } from '@libs/guards/roles.decorator';
import { RolesGuard } from '@libs/guards/roles.guard';
import { GetEquipmentsService } from '@modules/equipment/application/queries/get-equipments/get-equipments.service';
import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { EquipmentDto, UserRoles } from 'shared';

import { mapEquipmentToDto } from '../mappers/equipment.mapper';

@Controller('equipments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoles.USER)
export class GetEquipmentsHttpController {
  private readonly logger = new Logger(GetEquipmentsHttpController.name);

  constructor(private readonly getEquipmentsService: GetEquipmentsService) {}

  @Get()
  async getEquipments(): Promise<EquipmentDto[]> {
    const equipments = await this.getEquipmentsService.execute();
    return equipments.map(mapEquipmentToDto);
  }
}
