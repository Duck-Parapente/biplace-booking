import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class PlanningReservationDto {
  @IsNotEmpty()
  @IsUUID()
  id!: string;

  @IsNotEmpty()
  @IsBoolean()
  isCancelable!: boolean;

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
  @IsDateString()
  date!: string;

  @IsArray()
  @ArrayNotEmpty()
  packs!: PackPlanningDto[];
}
