import { prisma } from '@libs/database/prisma/prisma';
import { Email } from '@libs/ddd';
import { UUID, UuidProps } from '@libs/ddd/uuid.value-object';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { EventEmitterPort } from '@libs/events/domain/event-emitter.port';
import { UserRepositoryPort } from '@modules/user/domain/ports/user.repository.port';
import { UserEntity } from '@modules/user/domain/user.entity';
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
        id: user.id.uuid,
        email: user.email.email,
        externalAuthId: user.externalAuthId,
      },
    });

    await user.publishEvents(this.eventEmitter);
    this.logger.log(`User created: ${user.id}`);
  }

  async update(user: UserEntity): Promise<void> {
    await prisma.user.update({
      where: { id: user.id.uuid },
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

  async findById(userId: UuidProps): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId.uuid },
    });

    if (!user) {
      return null;
    }

    const { id, email, externalAuthId, ...otherProps } = user;

    return new UserEntity({
      id: new UUID({ uuid: id }),
      props: {
        email: new Email({ email }),
        externalAuthId,
        ...otherProps,
      },
    });
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user) => {
      const { id, email, externalAuthId, ...otherProps } = user;
      return new UserEntity({
        id: new UUID({ uuid: id }),
        props: {
          email: new Email({ email }),
          externalAuthId,
          ...otherProps,
        },
      });
    });
  }
}
