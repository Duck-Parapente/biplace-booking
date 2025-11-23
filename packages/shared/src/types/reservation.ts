import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum ReservationStatusDto {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REFUSED = 'REFUSED',
  CANCELLED = 'CANCELLED',
}

export class CreateReservationWishDto {
  @IsNotEmpty()
  @IsDateString()
  startingDate!: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  packChoices!: string[];

  @IsOptional()
  @IsString()
  publicComment?: string;
}

export class ReservationWishDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsNotEmpty()
  @IsDate()
  createdAt!: Date;

  @IsNotEmpty()
  @IsDate()
  startingDate!: Date;

  @IsNotEmpty()
  @IsDate()
  endingDate!: Date;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  packChoices!: string[];

  @IsNotEmpty()
  @IsEnum(ReservationStatusDto)
  status!: ReservationStatusDto;

  @IsOptional()
  @IsString()
  publicComment?: string;
}
