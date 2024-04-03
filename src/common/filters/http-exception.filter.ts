import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();

    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const isPrismaError =
      exception instanceof Prisma.PrismaClientKnownRequestError ||
      exception instanceof Prisma.PrismaClientUnknownRequestError ||
      exception instanceof Prisma.PrismaClientRustPanicError ||
      exception instanceof Prisma.PrismaClientInitializationError ||
      exception instanceof Prisma.PrismaClientValidationError;

    const handlePrismaQueryError =
      process.env.NODE_ENV === 'production' && isPrismaError;

    let responseCode: HttpStatus;
    if (handlePrismaQueryError) {
      responseCode = HttpStatus.BAD_REQUEST;
    } else if (exception instanceof HttpException) {
      responseCode = exception.getStatus();
    } else {
      responseCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    let responseMessage: string;
    if (handlePrismaQueryError) {
      responseMessage = 'Invalid query';
    } else if (exception.response?.statusCode === 400) {
      responseMessage = exception.response.message;
    } else {
      responseMessage = exception.message;
    }

    const exceptionMessage =
      exception.response?.statusCode === 400
        ? `
            Validation Error: ${exception.response.message}
      
            Stack Trace: ${exception.stack}
            `
        : exception.stack;

    Logger.error(
      exceptionMessage,
      `Exception ${request.method} ${request.url}`,
    );

    const responseData = {
      responseStatus: 'FAILED',
      responseCode,
      responseMessage,
    };

    return response.status(responseCode).json(responseData);
  }
}
