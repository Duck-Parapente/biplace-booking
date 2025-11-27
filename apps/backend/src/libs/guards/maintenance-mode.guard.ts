import { FeatureFlagProvider } from '@libs/database/helpers/feature-flag.provider';
import { CanActivate, Injectable, ServiceUnavailableException } from '@nestjs/common';

export const MAINTENANCE_MODE_KEY = 'maintenance_mode';

@Injectable()
export class MaintenanceModeGuard implements CanActivate {
  constructor(private readonly featureFlagProvider: FeatureFlagProvider) {}

  async canActivate(): Promise<boolean> {
    const isMaintenanceModeActive =
      await this.featureFlagProvider.isFlagActive(MAINTENANCE_MODE_KEY);

    if (isMaintenanceModeActive) {
      throw new ServiceUnavailableException('Service is currently under maintenance');
    }

    return true;
  }
}
