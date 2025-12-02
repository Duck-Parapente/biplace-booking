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
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export enum ReservationWishStatusDto {
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

export class CreateReservationDto {
  @IsNotEmpty()
  @IsDateString()
  startingDate!: string;

  @IsUUID()
  @IsNotEmpty()
  packId!: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

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

  @IsNotEmpty()
  @IsEnum(ReservationStatusDto)
  status!: ReservationStatusDto;
}

export class ReservationWishEventDto {
  @IsNotEmpty()
  @IsEnum(ReservationWishStatusDto)
  status!: ReservationWishStatusDto;

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
  @IsString({ each: true })
  events!: ReservationWishEventDto[];

  @IsNotEmpty()
  @IsEnum(ReservationWishStatusDto)
  status!: ReservationWishStatusDto;

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
  reservation!: ReservationDto | null;
}

export class PlanningReservationDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  publicComment?: string | null;
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
  reservation?: PlanningReservationDto | null;
}

export class PlanningDayDto {
  @IsNotEmpty()
  @IsDate()
  date!: Date;

  @IsArray()
  @ArrayNotEmpty()
  packs!: PackPlanningDto[];
}
