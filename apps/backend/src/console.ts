import { AppModule } from '@app.module';
import { BootstrapConsole } from 'nestjs-console';
import { Logger } from 'nestjs-pino';

const bootstrap = new BootstrapConsole({
  module: AppModule,
  useDecorators: true,
});
bootstrap.init().then(async (app) => {
  try {
    await app.init();
    app.useLogger(app.get(Logger));
    await bootstrap.boot();
    process.exit(0);
  } catch (e) {
    console.error('Error during console execution', e);
    process.exit(1);
  }
});
