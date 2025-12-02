import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum ReservationStatusDto {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export enum ReservationWishStatusDto {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REFUSED = 'REFUSED',
  CANCELLED = 'CANCELLED',
}

export class ReservationDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsNotEmpty()
  @IsString()
  packId!: string;
}

export enum ReservationEventTypeDto {
  WISH = 'WISH',
  RESERVATION = 'RESERVATION',
}

export class ReservationWishEventDto {
  @IsNotEmpty()
  @IsEnum(ReservationWishStatusDto)
  status!: ReservationWishStatusDto;

  @IsNotEmpty()
  type!: ReservationEventTypeDto.WISH;

  @IsNotEmpty()
  @IsDate()
  date!: Date;
}

export class ReservationEventDto {
  @IsNotEmpty()
  @IsEnum(ReservationStatusDto)
  status!: ReservationStatusDto;

  @IsNotEmpty()
  @IsEnum(ReservationEventTypeDto)
  type!: ReservationEventTypeDto.RESERVATION;

  @IsNotEmpty()
  @IsDate()
  date!: Date;
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

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  events!: (ReservationEventDto | ReservationWishEventDto)[];

  @IsNotEmpty()
  @IsBoolean()
  isCancelable!: boolean;

  @IsOptional()
  @IsString()
  publicComment?: string;

  @IsOptional()
  reservation!: ReservationDto | null;
}
