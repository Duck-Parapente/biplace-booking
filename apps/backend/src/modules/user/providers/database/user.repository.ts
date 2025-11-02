import { prisma } from '@libs/database/prisma/prisma';
import { UserRepositoryPort } from '@modules/user/domain/ports/user.repository.port';
import { UserEntity } from '@modules/user/domain/user.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  private readonly logger = new Logger(UserRepository.name);

  async save(user: UserEntity): Promise<void> {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email.email,
        externalAuthId: user.externalAuthId,
      },
    });
    this.logger.log(`User saved: ${user.id} (${user.email})`);
  }
}
