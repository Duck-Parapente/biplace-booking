import { UUID } from '@libs/ddd/uuid.value-object';
import { JwtAuthGuard } from '@libs/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@libs/guards/jwt.strategy';
import { MaintenanceModeGuard } from '@libs/guards/maintenance-mode.guard';
import { Roles } from '@libs/guards/roles.decorator';
import { RolesGuard } from '@libs/guards/roles.guard';
import { CreatePackNoteCommand } from '@modules/pack/application/commands/create-pack-note/create-pack-note.command';
import { CreatePackNoteService } from '@modules/pack/application/commands/create-pack-note/create-pack-note.service';
import { Body, Controller, Logger, Param, Post, Request, UseGuards } from '@nestjs/common';
import { CreatePackNoteDto, UserRoles } from 'shared';

@Controller('packs/:packId/notes')
@UseGuards(JwtAuthGuard, RolesGuard, MaintenanceModeGuard)
@Roles(UserRoles.ADMIN, UserRoles.MANAGER)
export class CreatePackNoteHttpController {
  private readonly logger = new Logger(CreatePackNoteHttpController.name);

  constructor(private readonly createPackNoteService: CreatePackNoteService) {}

  @Post()
  async createPackNote(
    @Param('packId') packId: string,
    @Body() dto: CreatePackNoteDto,
    @Request() { user: { id: userId } }: { user: AuthenticatedUser },
  ) {
    const command = new CreatePackNoteCommand({
      props: {
        packId: new UUID({ uuid: packId }),
        content: dto.content,
        createdById: userId,
      },
      metadata: { userId },
    });

    await this.createPackNoteService.execute(command);

    return { message: 'Pack note created' };
  }
}
