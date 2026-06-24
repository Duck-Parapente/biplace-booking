import { EquipmentEntity } from '@modules/equipment/domain/equipment.entity';
import { EquipmentRepositoryPort } from '@modules/equipment/domain/ports/equipment.repository.port';
import { EQUIPMENT_REPOSITORY } from '@modules/equipment/equipment.di-tokens';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GetEquipmentsService {
  private readonly logger = new Logger(GetEquipmentsService.name);

  constructor(
    @Inject(EQUIPMENT_REPOSITORY)
    private readonly equipmentRepository: EquipmentRepositoryPort,
  ) {}

  async execute(): Promise<EquipmentEntity[]> {
    return this.equipmentRepository.findAll();
  }
}
