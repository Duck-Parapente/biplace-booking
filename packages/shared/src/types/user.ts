// Profile subset used for update operations
export interface UserProfileDto {
  firstName?: string;
  lastName?: string;
  address?: string;
  phoneNumber?: string;
}

export interface UserDto extends UserProfileDto {
  id: string;
  email: string;
  externalAuthId: string;
  currentScore?: number;
  createdAt: Date;
}
