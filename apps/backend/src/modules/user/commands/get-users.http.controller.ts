import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { Controller, Logger, Get, UseGuards } from '@nestjs/common';
import { UserDto } from 'shared';

import { GetUsersService } from './get-users.service';
import { mapUserToDto } from './user.mapper';

@Controller('users')
export class GetUsersHttpController {
  private readonly logger = new Logger(GetUsersHttpController.name);

  constructor(private readonly getUsersService: GetUsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(): Promise<UserDto[]> {
    const users = await this.getUsersService.execute();
    return users.map(mapUserToDto);
  }
}
