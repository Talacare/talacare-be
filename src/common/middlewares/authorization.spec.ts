import { AuthMiddleware } from './authorization';
import { ResponseUtil } from '../utils/response.util';
import { UnauthorizedException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

process.env.JWT_SECRET = 'SECRETCODE';

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;

  beforeEach(() => {
    middleware = new AuthMiddleware();
  });

  it('should call next() if authorization header is present and valid', () => {
    const expiredToken = sign(
      {
        id: 'f16b14ee-f594-4b7a-bf1d-afe67a9704a2',
        email: 'test@test.com',
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );

    const req: any = {
      headers: {
        authorization: `Bearer ${expiredToken}`,
      },
    };
    const next = jest.fn();

    middleware.use(req, next);

    expect(next).toHaveBeenCalled();
    expect(req.id).toEqual('f16b14ee-f594-4b7a-bf1d-afe67a9704a2');
    expect(req.email).toEqual('test@test.com');
  });

  it('should throw UnauthorizedException if authorization header is present and invalid', () => {
    const req: any = {
      headers: {
        authorization: 'Bearer invalid_token_here',
      },
    };
    const next = jest.fn();

    expect(() => middleware.use(req, next)).toThrowError(UnauthorizedException);
  });

  it('should throw UnauthorizedException if authorization token is missing in the request header', () => {
    const req: any = {
      headers: {},
    };
    const next = jest.fn();

    expect(() => middleware.use(req, next)).toThrowError(UnauthorizedException);
  });

  it('should throw UnauthorizedException if Bearer is missing in the request header', () => {
    const req: any = {
      headers: {
        authorization: 'Invalid_Header',
      },
    };
    const next = jest.fn();

    expect(() => middleware.use(req, next)).toThrowError(UnauthorizedException);
  });
});
