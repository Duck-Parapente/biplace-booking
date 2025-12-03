import { UserRepositoryPort } from '@modules/user/domain/ports/user.repository.port';
import { UserEntity } from '@modules/user/domain/user.entity';
import { USER_REPOSITORY } from '@modules/user/user.di-tokens';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { UpdateUserCommand } from './update-user.command';

@Injectable()
export class UpdateUserService {
  private readonly logger = new Logger(UpdateUserService.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UserEntity> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${command.userId.uuid} not found`);
    }

    user.update(command.profile);

    await this.userRepository.update(user);

    return user;
  }
}
