import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
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

export class CloseReservationDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  flightTimeMinutes!: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  flightsCount!: number;

  @IsOptional()
  @IsString()
  publicComment?: string;

  @IsOptional()
  @IsString()
  privateComment?: string;
}
