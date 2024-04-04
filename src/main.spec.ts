// const app = {
//   useGlobalPipes: jest.fn(),
//   use: jest.fn(),
//   listen: jest.fn(),
// };

// jest.mock('@nestjs/core', () => ({
//   NestFactory: {
//     create: jest.fn().mockResolvedValue(app),
//   },
// }));

// jest.mock('./app.module', () => ({
//   AppModule: jest.fn(),
// }));

// jest.mock('@nestjs/common', () => ({
//   ValidationPipe: jest.fn().mockImplementation(() => ({})),
// }));

// const mockSentry = {
//   init: jest.fn(),
//   Handlers: {
//     requestHandler: jest.fn(() => jest.fn()),
//     errorHandler: jest.fn(() => jest.fn()),
//   },
//   autoDiscoverNodePerformanceMonitoringIntegrations: jest
//     .fn()
//     .mockReturnValue([]),
// };

// jest.mock('@sentry/node', () => mockSentry);

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// const bootstrap = require('./main');

// describe('bootstrap function', () => {
//   it('should create a NestJS application using the AppModule', async () => {
//     await bootstrap();
//     expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
//   });

//   it('should set global validation pipes', async () => {
//     app.useGlobalPipes.mockClear();

//     await bootstrap();
//     expect(app.useGlobalPipes).toBeCalled();
//   });

//   it('should initialize Sentry with the correct configuration', async () => {
//     await bootstrap();
//     expect(mockSentry.init).toHaveBeenCalledWith({
//       dsn: process.env.SENTRY_DNS,
//       tracesSampleRate: 1.0,
//       integrations: expect.anything(),
//     });
//   });

//   it('should use Sentry request and error handlers', async () => {
//     app.use.mockClear();

//     await bootstrap();
//     expect(app.use).toHaveBeenCalledWith(expect.any(Function));
//     expect(app.use).toBeCalledTimes(2);
//   });

//   it('should listen on the correct port', async () => {
//     const defaultPort = 3000;

//     await bootstrap();
//     expect(app.listen).toHaveBeenCalledWith(process.env.PORT || defaultPort);
//   });
// });
