import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ResponseUtil } from '../common/utils/response.util';
import { CustomRequest } from 'src/common/interfaces/request.interface';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let responseUtil: ResponseUtil;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, ResponseUtil, PrismaService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    responseUtil = module.get<ResponseUtil>(ResponseUtil);
  });

  it('should return token on successful Google login', async () => {
    const mockRequest = {} as CustomRequest;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest
      .spyOn(authService, 'verifyGoogleToken')
      .mockResolvedValueOnce('mocktoken');
    jest.spyOn(responseUtil, 'response').mockReturnValueOnce({});

    await controller.googleLogin(mockRequest, mockResponse);

    expect(authService.verifyGoogleToken).toHaveBeenCalledWith(mockRequest);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
  });

  it('should return unauthorized error if token is invalid or expired', async () => {
    const mockRequest = {} as CustomRequest;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(authService, 'verifyGoogleToken').mockResolvedValueOnce(null);

    await controller.googleLogin(mockRequest, mockResponse);

    expect(authService.verifyGoogleToken).toHaveBeenCalledWith(mockRequest);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(mockResponse.json).toHaveBeenCalledWith({
      responseMessage: 'Token invalid or expired',
      responseStatus: 'FAILED',
      responseCode: HttpStatus.UNAUTHORIZED,
    });
  });
});
