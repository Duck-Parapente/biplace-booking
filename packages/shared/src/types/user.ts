import {
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UserProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;
  @IsOptional()
  @IsString()
  lastName?: string;
  @IsOptional()
  @IsString()
  address?: string;
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}

export class UserDto extends UserProfileDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  externalAuthId!: string;

  @IsNotEmpty()
  @IsNumber()
  currentScore!: number;

  @IsNotEmpty()
  @IsDateString()
  createdAt!: string;
}
