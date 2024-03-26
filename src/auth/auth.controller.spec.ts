import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ResponseUtil } from '../common/utils/response.util';
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

  it('should return user information when authenticated', async () => {
    const userId = '81c41b32-7a45-4b64-a98e-928f16fc26d7';
    const user = {
      id: userId,
      email: 'john@example.com',
    };
    const mockRequest = { user: { id: userId } };

    jest.spyOn(authService, 'getUser').mockResolvedValueOnce(user);

    await controller.authenticate(mockRequest as any);

    expect(authService.getUser).toHaveBeenCalledWith(userId);
  });
});
