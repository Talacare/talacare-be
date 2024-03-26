import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

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

  describe('Sign in', () => {
    it('should return user if id found', async () => {
      const userId = '81c41b32-7a45-4b64-a98e-928f16fc26d7';
      const user = {
        id: userId,
        email: 'john@example.com',
      };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(user);

      const result = await service.getUser(userId);
      expect(result).toEqual(user);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: userId,
        },
      });
    });
  });
});
