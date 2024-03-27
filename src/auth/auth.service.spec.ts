import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { CustomRequest } from 'src/common/interfaces/request.interface';
import { auth } from 'firebase-admin';
import { sign } from 'jsonwebtoken';

jest.mock('jsonwebtoken');

jest.mock('firebase-admin', () => {
  const auth = jest.fn(() => ({
    verifyIdToken: jest.fn(),
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAccessToken', () => {
    it('should return access token', async () => {
      const mockRequest = {
        email: 'john@example.com',
      } as unknown as CustomRequest;
      const mockUser = {
        id: '81c41b32-7a45-4b64-a98e-928f16fc26d7',
        email: 'john@example.com',
      };
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
        },
        process.env.JWT_SECRET,
        { expiresIn: '3d' },
      );
    });
  });

  describe('getUser', () => {
    it('should return existing user', async () => {
      const mockRequest = {
        email: 'john@example.com',
      } as unknown as CustomRequest;
      const mockUser = {
        id: '81c41b32-7a45-4b64-a98e-928f16fc26d7',
        email: 'john@example.com',
      };

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
      const mockRequest = {
        email: 'john@example.com',
      } as unknown as CustomRequest;
      const mockUser = {
        id: '81c41b32-7a45-4b64-a98e-928f16fc26d7',
        email: 'john@example.com',
      };

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
