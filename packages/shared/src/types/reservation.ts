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

export enum ReservationWishStatusDto {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REFUSED = 'REFUSED',
  CANCELLED = 'CANCELLED',
  CLOSED = 'CLOSED',
}

export type CostUpdateType = 'MANUAL_COST_UPDATED' | 'AUTOMATIC_COST_UPDATED';

export enum EventType {
  WISH = 'WISH',
  RESERVATION = 'RESERVATION',
}

export class ReservationDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsNotEmpty()
  @IsString()
  packId!: string;

  @IsNotEmpty()
  @IsBoolean()
  isCancelable!: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isClosable!: boolean;

  @IsNotEmpty()
  @IsInt()
  cost!: number;
}

export class ReservationWishStatusUpdateDto {
  @IsNotEmpty()
  @IsEnum(ReservationWishStatusDto)
  status!: ReservationWishStatusDto;

  @IsNotEmpty()
  @IsDateString()
  date!: string;

  @IsNotEmpty()
  @IsEnum(EventType)
  type!: EventType;
}

export class ReservationCostUpdateDto {
  @IsNotEmpty()
  @IsInt()
  cost!: number;

  @IsNotEmpty()
  @IsDateString()
  date!: string;

  @IsString()
  @IsNotEmpty()
  type!: CostUpdateType;
}

export class ReservationWishDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsNotEmpty()
  @IsDateString()
  createdAt!: string;

  @IsNotEmpty()
  @IsDateString()
  startingDate!: string;

  @IsNotEmpty()
  @IsDateString()
  endingDate!: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  packChoices!: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  statusUpdates!: ReservationWishStatusUpdateDto[];

  @IsArray()
  costUpdates!: ReservationCostUpdateDto[];

  @IsNotEmpty()
  @IsBoolean()
  isCancelable!: boolean;

  @IsOptional()
  @IsString()
  publicComment?: string;

  @IsOptional()
  reservation!: ReservationDto | null;
}

export class FlightLogDto {
  @IsNotEmpty()
  @IsInt()
  flightTimeMinutes!: number;

  @IsNotEmpty()
  @IsInt()
  flightsCount!: number;

  @IsOptional()
  @IsString()
  publicComment?: string | null;
}

class PackReservationDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsNotEmpty()
  @IsDateString()
  startingDate!: string;

  @IsNotEmpty()
  @IsDateString()
  endingDate!: string;

  @IsNotEmpty()
  @IsEnum(ReservationWishStatusDto)
  status!: ReservationWishStatusDto;

  @IsOptional()
  @IsInt()
  manualCost!: number | null;

  @IsOptional()
  @IsInt()
  automaticCost!: number | null;

  @IsOptional()
  @IsString()
  userName!: string | null;

  @IsOptional()
  flightLog!: FlightLogDto | null;
}

export class PackReservationsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmpty({ each: true })
  reservations!: PackReservationDto[];

  @IsInt()
  @IsNotEmpty()
  totalFlightsMinutes!: number;

  @IsInt()
  @IsNotEmpty()
  totalFlightsCount!: number;

  @IsString()
  @IsNotEmpty()
  ownerFullName!: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsString()
  @IsOptional()
  details?: string | null;

  @IsDateString()
  @IsOptional()
  lastControlDate?: string | null;

  @IsDateString()
  @IsOptional()
  lastRescueFoldingDate?: string | null;
}
