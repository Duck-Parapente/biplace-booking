import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { Roles } from '@libs/guards/roles.decorator';
import { RolesGuard } from '@libs/guards/roles.guard';
import { GetPacksService } from '@modules/pack/application/queries/get-packs/get-packs.service';
import { Controller, Logger, Get, UseGuards } from '@nestjs/common';
import { PackDto, UserRoles } from 'shared';

import { mapPackToDto } from '../mappers/pack.mapper';

@Controller('packs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoles.USER)
export class GetPacksHttpController {
  private readonly logger = new Logger(GetPacksHttpController.name);

  constructor(private readonly getPacksService: GetPacksService) {}

  @Get()
  async getPacks(): Promise<PackDto[]> {
    const packs = await this.getPacksService.execute();
    return packs.map(mapPackToDto);
  }
}
