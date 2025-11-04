import { prisma } from '@libs/database/prisma/prisma';
import { Email } from '@libs/ddd';
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

  async create(user: UserEntity): Promise<void> {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email.email,
        externalAuthId: user.externalAuthId,
      },
    });

    await user.publishEvents(this.eventEmitter);
    this.logger.log(`User created: ${user.id}`);
  }

  async update(user: UserEntity): Promise<void> {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        phoneNumber: user.phoneNumber,
      },
    });

    await user.publishEvents(this.eventEmitter);
    this.logger.log(`User updated: ${user.id}`);
  }

  async findById(userId: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    return UserEntity.fromPersistence(user.id, {
      email: new Email({ email: user.email }),
      externalAuthId: user.externalAuthId,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      phoneNumber: user.phoneNumber ?? undefined,
      address: user.address ?? undefined,
      currentScore: user.currentScore,
      createdAt: user.createdAt,
    });
  }
}
