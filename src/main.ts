import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // GlitchTip Monitoring Setup
  const client = new PrismaClient();
  const Sentry = require('@sentry/node');
  Sentry.init({
    dsn: process.env.SENTRY_DNS,
    enableTracing: true,
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    integrations: [
      ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
      new Sentry.Integrations.Prisma({ client }),
      new Sentry.Integrations.Http({ tracing: true }),
    ],
  });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
  app.use(Sentry.Handlers.errorHandler());

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
