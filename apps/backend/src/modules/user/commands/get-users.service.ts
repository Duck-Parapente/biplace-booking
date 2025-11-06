import { Inject, Injectable, Logger } from '@nestjs/common';

import { UserRepositoryPort } from '../domain/ports/user.repository.port';
import { UserEntity } from '../domain/user.entity';
import { USER_REPOSITORY } from '../user.di-tokens';

@Injectable()
export class GetUsersService {
  private readonly logger = new Logger(GetUsersService.name);

  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(): Promise<UserEntity[]> {
    const users = await this.userRepository.findAll();

    this.logger.log(`Fetched ${users.length} users`);
    return users;
  }
}
