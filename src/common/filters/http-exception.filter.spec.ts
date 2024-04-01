import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { mockDeep } from 'jest-mock-extended';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockContext: any;
  let mockHost: any;
  let errorParams: any;
  const logger = mockDeep<Logger>();

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter]
    })
    .compile();

    module.useLogger(logger);
    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);

    errorParams = {
      clientVersion: '5.9.1',
      code: 'P1000',
      meta: {
        someKey: 'someValue',
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockRequest = {};
    mockContext = {
      getRequest: jest.fn().mockReturnValue(mockRequest),
      getResponse: jest.fn().mockReturnValue(mockResponse),
    };
    mockHost = {
      switchToHttp: jest.fn().mockReturnValue(mockContext),
    };
  });

  it('should handle Prisma errors in production (BAD_REQUEST)', () => {
    process.env.NODE_ENV = 'production';
    const prismaError = new PrismaClientKnownRequestError(
      'Invalid query',
      errorParams,
    );

    filter.catch(prismaError, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      responseStatus: 'FAILED',
      responseCode: HttpStatus.BAD_REQUEST,
      responseMessage: 'Invalid query',
    });
  });

  it('should handle Prisma errors outside production (INTERNAL_SERVER_ERROR)', () => {
    process.env.NODE_ENV = 'development';
    const prismaError = new PrismaClientKnownRequestError(
      'Invalid query',
      errorParams,
    );

    filter.catch(prismaError, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      responseStatus: 'FAILED',
      responseCode: HttpStatus.INTERNAL_SERVER_ERROR,
      responseMessage: 'Invalid query',
    });
  });

  it('should handle other HttpExceptions (status code preserved)', () => {
    const httpException = new BadRequestException('Validation error');

    filter.catch(httpException, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      responseStatus: 'FAILED',
      responseCode: HttpStatus.BAD_REQUEST,
      responseMessage: 'Validation error',
    });
  });

  it('should handle generic errors (INTERNAL_SERVER_ERROR)', () => {
    const genericError = new Error('Unknown error');

    filter.catch(genericError, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      responseStatus: 'FAILED',
      responseCode: HttpStatus.INTERNAL_SERVER_ERROR,
      responseMessage: 'Unknown error',
    });
  });
});
