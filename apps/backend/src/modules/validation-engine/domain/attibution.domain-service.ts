import { Injectable } from '@nestjs/common';

@Injectable()
export class AttributionDomainService {
  async attributePacks(): Promise<number> {
    return 42;
  }
}
