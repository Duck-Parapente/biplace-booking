import { FeatureFlagProvider } from '@libs/database/helpers/feature-flag.provider';
import { Global, Module } from '@nestjs/common';

import { PublicConfigHttpController } from './commands/public-config.http.controller';

@Global()
@Module({
  imports: [],
  controllers: [PublicConfigHttpController],
  providers: [FeatureFlagProvider],
  exports: [FeatureFlagProvider],
})
export class FeatureFlagModule {}
