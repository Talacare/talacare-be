import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { CustomRequest } from 'src/common/interfaces/request.interface';
import { sign } from 'jsonwebtoken';
import { mockDeep } from 'jest-mock-extended';
import { Logger, UnauthorizedException } from '@nestjs/common';

jest.mock('jsonwebtoken');

const mockVerify = jest.fn();
jest.mock('firebase-admin', () => {
  const auth = jest.fn(() => ({
    verifyIdToken: mockVerify,
  }));
  return {
    __esModule: true,
    ...jest.requireActual('firebase-admin'),
    auth: auth,
    default: auth,
  };
});

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let mockRequest: CustomRequest;
  let mockUser: any;
  const logger = mockDeep<Logger>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService],
    }).compile();
    module.useLogger(logger);

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    mockRequest = {
      headers: {
        authorization: 'Bearer mock-id-token',
      },
      email: 'john@example.com',
    } as unknown as CustomRequest;
    mockUser = {
      id: '81c41b32-7a45-4b64-a98e-928f16fc26d7',
      email: 'john@example.com',
      role: 'USER',
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verifyGoogleToken', () => {
    it('should throw UnauthorizedException for invalid token', async () => {
      const mockError = new Error('Firebase ID token has expired');
      mockVerify.mockRejectedValue(mockError);

      await expect(service.verifyGoogleToken(mockRequest)).rejects.toThrowError(
        UnauthorizedException,
      );
      expect(mockVerify).toHaveBeenCalledWith(
        mockRequest.headers.authorization,
      );
    });

    it('should set email on request and call getAccessToken for valid token', async () => {
      const mockDecodedToken = { email: 'john@doe.com' };
      mockVerify.mockResolvedValue(mockDecodedToken);
      jest.spyOn(service, 'getAccessToken');

      await service.verifyGoogleToken(mockRequest);

      expect(mockRequest.email).toEqual(mockDecodedToken.email);
      expect(service.getAccessToken).toHaveBeenCalledWith(mockRequest);
    });
  });

  describe('getAccessToken', () => {
    it('should return access token', async () => {
      const mockToken = 'mockToken';

      jest.spyOn(service, 'getUser').mockResolvedValueOnce(mockUser);
      (sign as jest.Mock).mockReturnValueOnce(mockToken);

      const result = await service.getAccessToken(mockRequest);

      expect(result).toEqual(mockToken);
      expect(service.getUser).toHaveBeenCalledWith(mockRequest);
      expect(sign).toHaveBeenCalledWith(
        {
          user_id: '81c41b32-7a45-4b64-a98e-928f16fc26d7',
          email: 'john@example.com',
          role: 'USER',
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRED_AT },
      );
    });
  });

  describe('getUser', () => {
    it('should return existing user', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce(mockUser);

      const result = await service.getUser(mockRequest);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
    });

    it('should create and return new user if not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValueOnce(mockUser);

      const result = await service.getUser(mockRequest);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: { email: 'john@example.com' },
      });
    });
  });
});
