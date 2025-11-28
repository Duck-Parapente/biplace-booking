import { UserRepositoryPort } from '@modules/user/domain/ports/user.repository.port';
import { UserEntity } from '@modules/user/domain/user.entity';
import { USER_REPOSITORY } from '@modules/user/user.di-tokens';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { GetUserCommand } from './get-user.command';

@Injectable()
export class GetUserService {
  private readonly logger = new Logger(GetUserService.name);

  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: GetUserCommand): Promise<UserEntity> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      this.logger.warn(`User not found: ${command.userId.uuid}`);
      throw new NotFoundException(`User with ID ${command.userId.uuid} not found`);
    }

    return user;
  }
}
