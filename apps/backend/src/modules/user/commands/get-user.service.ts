import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { UserRepositoryPort } from '../domain/ports/user.repository.port';
import { UserEntity } from '../domain/user.entity';
import { USER_REPOSITORY } from '../user.di-tokens';

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
      this.logger.warn(`User not found: ${command.userId}`);
      throw new NotFoundException(`User with ID ${command.userId} not found`);
    }

    this.logger.log(`User fetched: ${user.id}`);
    return user;
  }
}
