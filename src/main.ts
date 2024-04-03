import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // GlitchTip Monitoring Setup
  const Sentry = require('@sentry/node');
  Sentry.init({
    dsn: process.env.SENTRY_DNS,
    tracesSampleRate: 1.0,
    integrations: [
      ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
    ],
  });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.errorHandler());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
