import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
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

export class ReservationDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsNotEmpty()
  @IsString()
  packId!: string;
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

  @IsNotEmpty()
  @IsBoolean()
  isCancelable!: boolean;

  @IsOptional()
  @IsString()
  publicComment?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  reservations!: ReservationDto[];
}

export class PackPlanningDto {
  @IsNotEmpty()
  @IsUUID()
  packId!: string;

  @IsNotEmpty()
  @IsString()
  packLabel!: string;

  @IsNotEmpty()
  pendingWishesCount!: number;

  @IsOptional()
  reservation?: {
    username: string;
    comment: string;
  } | null;
}

export class PlanningDayDto {
  @IsNotEmpty()
  @IsDate()
  date!: Date;

  @IsArray()
  @ArrayNotEmpty()
  packs!: PackPlanningDto[];
}
