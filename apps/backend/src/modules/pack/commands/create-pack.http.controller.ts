import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { Roles } from '@libs/guards/roles.decorator';
import { RolesGuard } from '@libs/guards/roles.guard';
import { Controller, Post, Body, Logger, UseGuards, Request } from '@nestjs/common';
import { CreatePackDto, UserRoles } from 'shared';

import { CreatePackCommand } from './create-pack.command';
import { CreatePackService } from './create-pack.service';

@Controller('packs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoles.ADMIN)
export class CreatePackHttpController {
  private readonly logger = new Logger(CreatePackHttpController.name);

  constructor(private readonly createPackService: CreatePackService) {}

  @Post()
  async createPack(
    @Body() body: CreatePackDto,
    @Request() { user: { id: userId } }: { user: AuthenticatedUser },
  ) {
    const command = new CreatePackCommand({
      profile: {
        ...body,
        ownerId: new UUID({ uuid: body.ownerId }),
      },
      metadata: {
        userId: userId.uuid,
      },
    });

    await this.createPackService.execute(command);

    return { message: 'Pack created' };
  }
}
