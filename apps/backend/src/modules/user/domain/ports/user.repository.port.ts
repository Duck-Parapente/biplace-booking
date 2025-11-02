import { UserEntity } from '../user.entity';

export interface UserRepositoryPort {
  save(user: UserEntity): void;
}
