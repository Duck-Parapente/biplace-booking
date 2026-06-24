import { EquipmentRepositoryPort } from '@modules/equipment/domain/ports/equipment.repository.port';
import { EQUIPMENT_REPOSITORY } from '@modules/equipment/equipment.di-tokens';
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SetEquipmentHolderCommand } from './set-equipment-holder.command';

@CommandHandler(SetEquipmentHolderCommand)
export class SetEquipmentHolderService implements ICommandHandler<SetEquipmentHolderCommand, void> {
  private readonly logger = new Logger(SetEquipmentHolderService.name);

  constructor(
    @Inject(EQUIPMENT_REPOSITORY)
    private readonly equipmentRepository: EquipmentRepositoryPort,
  ) {}

  async execute({ equipmentId, holderId, metadata }: SetEquipmentHolderCommand): Promise<void> {
    const equipment = await this.equipmentRepository.findById(equipmentId);
    if (!equipment) {
      throw new NotFoundException({ message: `Equipment ${equipmentId.uuid} not found` });
    }

    equipment.setHolder(holderId, metadata);
    await this.equipmentRepository.update(equipment);
  }
}
