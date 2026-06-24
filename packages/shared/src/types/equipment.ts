import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class EquipmentDto {
  @IsNotEmpty()
  @IsUUID()
  id!: string;

  @IsNotEmpty()
  @IsString()
  label!: string;

  @IsNumber()
  @IsNotEmpty()
  order!: number;

  @IsUUID()
  @IsOptional()
  currentHolderId?: string | null;

  @IsString()
  @IsOptional()
  currentHolderName?: string | null;
}

export class EquipmentNoteDto {
  @IsNotEmpty()
  @IsUUID()
  id!: string;

  @IsNotEmpty()
  @IsUUID()
  equipmentId!: string;

  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsNotEmpty()
  @IsDateString()
  createdAt!: string;

  @IsNotEmpty()
  @IsUUID()
  createdById!: string;
}

export class CreateEquipmentNoteDto {
  @IsNotEmpty()
  @IsString()
  content!: string;
}

export class UpdateEquipmentNoteDto {
  @IsNotEmpty()
  @IsString()
  content!: string;
}

export class SetEquipmentHolderDto {
  @IsOptional()
  @IsUUID()
  holderId?: string | null;
}
