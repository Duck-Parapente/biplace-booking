import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { Controller, Logger, Get, UseGuards } from '@nestjs/common';
import { PackDto } from 'shared';

import { GetPacksService } from './get-packs.service';
import { mapPackToDto } from './pack.mapper';

@Controller('packs')
export class GetPacksHttpController {
  private readonly logger = new Logger(GetPacksHttpController.name);

  constructor(private readonly getPacksService: GetPacksService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getPacks(): Promise<PackDto[]> {
    const packs = await this.getPacksService.execute();
    return packs.map(mapPackToDto);
  }
}
