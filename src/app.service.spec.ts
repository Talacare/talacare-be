import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getHello should call prisma.user.findMany', async () => {
    const hello = await service.getHello();
    expect(hello).toBe('hello api-talacare');
  });

  it('getEnvironment should return local if no VERCEL_ENV is set', async () => {
    delete process.env.VERCEL_ENV;
    const environment = await service.getEnvironment();
    expect(environment).toBe('local');
  });

  it('getEnvironment should return VERCEL_ENV if set', async () => {
    process.env.VERCEL_ENV = 'production';
    const environment = await service.getEnvironment();
    expect(environment).toBe('production');
  });

  it('postUser should call prisma.user.create with email', async () => {
    const email = 'test@example.com';
    const prismaSpy = jest.spyOn(mockPrismaService.user, 'create');
    await service.postUser(email);
    expect(prismaSpy).toHaveBeenCalledWith({
      data: { email },
    });
  });
});
