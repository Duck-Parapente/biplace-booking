export interface UserDto {
  id: string;
  email: string;
  externalAuthId: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  currentScore?: number;
  createdAt: Date;
}