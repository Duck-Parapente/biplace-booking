import { prisma } from '@libs/database/prisma/prisma';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FeatureFlagProvider {
  private readonly logger = new Logger(FeatureFlagProvider.name);

  async isFlagActive(featureKey: string): Promise<boolean> {
    const { isActive } = await prisma.featureFlag.findUniqueOrThrow({
      where: { key: featureKey },
      select: { isActive: true },
    });

    return isActive;
  }

  async setFlagState(featureKey: string, isActive: boolean): Promise<void> {
    await prisma.featureFlag.update({
      where: { key: featureKey },
      data: { isActive },
    });
  }
}
