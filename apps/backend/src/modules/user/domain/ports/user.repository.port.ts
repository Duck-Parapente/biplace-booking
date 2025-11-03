import { UserEntity } from '../user.entity';

export interface UserRepositoryPort {
  save(user: UserEntity): Promise<void>;
  findById(userId: string): Promise<UserEntity | null>;
}
