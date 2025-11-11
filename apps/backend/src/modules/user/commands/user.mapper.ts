import { UserDto } from 'shared';

import { UserEntity } from '../domain/user.entity';

export function mapUserToDto(user: UserEntity): UserDto {
  return {
    id: user.id.uuid,
    email: user.email.email,
    externalAuthId: user.externalAuthId,
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    address: user.address ?? '',
    phoneNumber: user.phoneNumber ?? '',
    currentScore: user.currentScore,
    createdAt: user.createdAt!,
  };
}
