import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { UserRepositoryPort } from '../domain/ports/user.repository.port';
import { UserEntity } from '../domain/user.entity';
import { USER_REPOSITORY } from '../user.di-tokens';

import { UpdateUserCommand } from './update-user.command';

@Injectable()
export class UpdateUserService {
  private readonly logger = new Logger(UpdateUserService.name);

  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UserEntity> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      this.logger.warn(`User not found: ${command.userId}`);
      throw new NotFoundException(`User with ID ${command.userId} not found`);
    }

    user.update(command.profile);

    await this.userRepository.update(user);

    this.logger.log(`User updated: ${user.id}`);
    return user;
  }
}
