import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

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

export enum ReservationContext {
  TRAINING = 'TRAINING',
  CLASSIC = 'CLASSIC',
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

  @IsNotEmpty()
  @IsEnum(ReservationContext)
  context!: ReservationContext;
}

export class CloseReservationDto {
  @IsNotEmpty()
  @IsInt()
  flightTimeMinutes!: number;

  @IsNotEmpty()
  @IsInt()
  flightsCount!: number;

  @IsOptional()
  @IsString()
  packNote?: string;

  @IsNotEmpty()
  @IsBoolean()
  shouldWarnPackOwner!: boolean;
}

export class UpdateReservationDto {
  @IsNotEmpty()
  @IsInt()
  manualCost!: number;
}
