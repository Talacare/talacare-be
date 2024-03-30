import { AuthMiddleware } from './auth.middleware';
import { ResponseUtil } from '../utils/response.util';
import { UnauthorizedException } from '@nestjs/common';

process.env.JWT_SECRET = 'SECRETCODE';

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;
  let responseUtil: ResponseUtil;

  beforeEach(() => {
    responseUtil = new ResponseUtil();
    middleware = new AuthMiddleware(responseUtil);
  });

  // it('should call next() if authorization header is present and valid', () => {
  //   const req: any = {
  //     headers: {
  //       authorization:
  //         'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjE2YjE0ZWUtZjU5NC00YjdhLWJmMWQtYWZlNjdhOTcwNGEyIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNzExNTIzMDA5LCJleHAiOjE3MTE3ODIyMDl9.RrE1lahlh7ja3MIA5e_AEWrpKP1_yDJKuCmoI1P16AA',
  //     },
  //   };
  //   const next = jest.fn();

  //   middleware.use(req, {} as any, next);

  //   expect(next).toHaveBeenCalled();

  //   expect(req.id).toEqual('f16b14ee-f594-4b7a-bf1d-afe67a9704a2');
  //   expect(req.email).toEqual('test@test.com');
  // });

  it('should throw UnauthorizedException if authorization header is present and invalid', () => {
    const req: any = {
      headers: {
        authorization: 'Bearer invalid_token_here',
      },
    };
    const next = jest.fn();

    expect(() => middleware.use(req, {} as any, next)).toThrowError(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if authorization token is missing in the request header', () => {
    const req: any = {
      headers: {},
    };
    const next = jest.fn();

    expect(() => middleware.use(req, {} as any, next)).toThrowError(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if Bearer is missing in the request header', () => {
    const req: any = {
      headers: {
        authorization: 'Invalid_Header',
      },
    };
    const next = jest.fn();

    expect(() => middleware.use(req, {} as any, next)).toThrowError(
      UnauthorizedException,
    );
  });
});
