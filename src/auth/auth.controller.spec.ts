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

  describe('googleLogin', () => {
    it('should return a successful login message with a token', async () => {
      const mockRequest: any = {};
      const mockToken = 'mockToken';

      jest
        .spyOn(authService, 'verifyGoogleToken')
        .mockResolvedValueOnce(mockToken);
      jest.spyOn(responseUtil, 'response').mockReturnValueOnce({});

      const result = await controller.googleLogin(mockRequest);

      expect(authService.verifyGoogleToken).toHaveBeenCalledWith(mockRequest);
      expect(responseUtil.response).toHaveBeenCalledWith(
        { responseMessage: 'Login Successful' },
        { token: mockToken },
      );
      expect(result).toEqual({});
    });
  });
});
