import { randomUUID } from 'crypto';

import { UUID } from '@libs/ddd/uuid.value-object';

export const createUUID = (): UUID => {
  return new UUID({ uuid: randomUUID() });
};
