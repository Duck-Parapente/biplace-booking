import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { Roles } from '@libs/guards/roles.decorator';
import { RolesGuard } from '@libs/guards/roles.guard';
import { GetUsersService } from '@modules/user/application/queries/get-users/get-users.service';
import { Controller, Logger, Get, UseGuards } from '@nestjs/common';
import { UserDto, UserRoles } from 'shared';

import { mapUserToDto } from '../mappers/user.mapper';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoles.USER)
export class GetUsersHttpController {
  private readonly logger = new Logger(GetUsersHttpController.name);

  constructor(private readonly getUsersService: GetUsersService) {}

  @Get()
  async getUsers(): Promise<UserDto[]> {
    const users = await this.getUsersService.execute();
    return users.map(mapUserToDto);
  }
}
