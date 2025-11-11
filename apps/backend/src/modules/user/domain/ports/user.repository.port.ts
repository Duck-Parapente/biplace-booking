import { UUID } from '@libs/ddd/uuid.value-object';

import { UserEntity } from '../user.entity';

export interface UserRepositoryPort {
  create(user: UserEntity): Promise<void>;
  update(user: UserEntity): Promise<void>;
  findById(userId: UUID): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
}
