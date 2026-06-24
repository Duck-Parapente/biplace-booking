import { Command, CommandProps } from '@libs/ddd';
import { UUID } from '@libs/ddd/uuid.value-object';

export class SetEquipmentHolderCommand extends Command {
  readonly equipmentId: UUID;
  readonly holderId: UUID | null;

  constructor(props: CommandProps<SetEquipmentHolderCommand>) {
    super(props);
    this.equipmentId = props.equipmentId;
    this.holderId = props.holderId;
  }
}
