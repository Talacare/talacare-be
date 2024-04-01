// src/app.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from '@prisma/client';

const mockAppService = {
  getHello: jest.fn(),
  getEnvironment: jest.fn(),
  postUser: jest.fn(),
};

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  describe('getHello', () => {
    it('should return users from the app service', async () => {
      const mockUsers: User[] = [{ id: '1', email: 'test@example.com' }];
      mockAppService.getHello.mockResolvedValue(mockUsers);

      const result = await appController.getHello();
      expect(result).toEqual(mockUsers);
      expect(mockAppService.getHello).toHaveBeenCalled();
    });
  });

  describe('getEnvironment', () => {
    it('should return the environment from the app service', async () => {
      const mockEnvironment = 'development';
      mockAppService.getEnvironment.mockResolvedValue(mockEnvironment);

      const result = await appController.getEnvironment();
      expect(result).toEqual(mockEnvironment);
      expect(mockAppService.getEnvironment).toHaveBeenCalled();
    });
  });

  describe('postUser', () => {
    it('should call postUser on the app service with the provided email', async () => {
      const email = 'test@example.com';
      const mockUser: User = { id: '1', email };
      mockAppService.postUser.mockResolvedValue(mockUser);

      const result = await appController.postUser(email);
      expect(result).toEqual(mockUser);
      expect(mockAppService.postUser).toHaveBeenCalledWith(email);
    });
  });
});
