import { IsBoolean, IsNotEmpty } from 'class-validator';

export class PublicConfigDto {
  @IsBoolean()
  @IsNotEmpty()
  maintenanceMode!: boolean;
}
