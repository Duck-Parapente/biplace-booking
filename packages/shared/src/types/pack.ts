import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePackDto {
  @IsNotEmpty()
  @IsUUID()
  ownerId!: string;

  @IsNotEmpty()
  @IsString()
  label!: string;

  @IsNumber()
  @IsOptional()
  flightsHours?: number;

  @IsNumber()
  @IsOptional()
  flightsCount?: number;
}

export class UpdatePackDto {
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @IsOptional()
  @IsString()
  label?: string;

  @IsNumber()
  @IsOptional()
  flightsHours?: number;

  @IsNumber()
  @IsOptional()
  flightsCount?: number;
}

export class PackDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsNotEmpty()
  @IsUUID()
  ownerId!: string;

  @IsNotEmpty()
  @IsString()
  label!: string;

  @IsNumber()
  @IsNotEmpty()
  flightsHours!: number;

  @IsNumber()
  @IsNotEmpty()
  flightsCount!: number;
}
