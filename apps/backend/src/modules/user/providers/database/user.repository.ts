import { prisma } from '@libs/database/prisma/prisma';
import { EventEmitterPort } from '@libs/events/domain/event-emitter.port';
import { UserRepositoryPort } from '@modules/user/domain/ports/user.repository.port';
import { UserEntity } from '@modules/user/domain/user.entity';
import { EVENT_EMITTER } from '@modules/user/user.di-tokens';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @Inject(EVENT_EMITTER)
    private readonly eventEmitter: EventEmitterPort,
  ) {}

  async save(user: UserEntity): Promise<void> {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email.email,
        externalAuthId: user.externalAuthId,
      },
    });

    await user.publishEvents(this.eventEmitter);
    this.logger.log(`User saved: ${user.id} (${user.email})`);
  }
}
