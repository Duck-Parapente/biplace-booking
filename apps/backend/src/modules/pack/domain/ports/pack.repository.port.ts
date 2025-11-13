import { PackEntity } from '../pack.entity';

export interface PackRepositoryPort {
  create(user: PackEntity): Promise<void>;
  findAll(): Promise<PackEntity[]>;
}
