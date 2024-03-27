import { AuthMiddleware } from './auth.middleware';
import { ResponseUtil } from '../utils/response.util';

process.env.JWT_SECRET = 'SECRETCODE';

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;
  let responseUtil: ResponseUtil;

  beforeEach(() => {
    responseUtil = new ResponseUtil();
    middleware = new AuthMiddleware(responseUtil);
  });

  it('should called next() if authorization header is present and valid', () => {
    const req: any = {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjE2YjE0ZWUtZjU5NC00YjdhLWJmMWQtYWZlNjdhOTcwNGEyIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNzExNTIzMDA5LCJleHAiOjE3MTE3ODIyMDl9.RrE1lahlh7ja3MIA5e_AEWrpKP1_yDJKuCmoI1P16AA',
      },
    };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(next).toHaveBeenCalled();

    expect(req.id).toEqual('f16b14ee-f594-4b7a-bf1d-afe67a9704a2');
    expect(req.email).toEqual('test@test.com');
  });

  it('should  return Access token invalid if authorization header is present and invalid', () => {
    const req: any = {
      headers: {
        authorization: 'Bearer invalid_token_here',
      },
    };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      responseCode: 401,
      responseStatus: 'FAILED',
      responseMessage: 'Access token invalid',
    });
  });

  it('should return Authorization token is missing in the request header if authorization header is missing', () => {
    const req: any = {
      headers: {},
    };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      responseCode: 401,
      responseStatus: 'FAILED',
      responseMessage: 'Authorization token is missing in the request header',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return Bearer is missing in the request header if authorization header is invalid', () => {
    const req: any = {
      headers: {
        authorization: 'Invalid_Header',
      },
    };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      responseCode: 401,
      responseStatus: 'FAILED',
      responseMessage: 'Bearer is missing in the request header',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
