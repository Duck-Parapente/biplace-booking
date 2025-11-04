import { UserEntity } from '../user.entity';

export interface UserRepositoryPort {
  create(user: UserEntity): Promise<void>;
  update(user: UserEntity): Promise<void>;
  findById(userId: string): Promise<UserEntity | null>;
}
