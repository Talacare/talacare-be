import { AuthMiddleware } from './auth.middleware';
import { ResponseUtil } from '../utils/response.util';

process.env.JWTSECRET = 'PPLAKECE';

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
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOiJ2YWxpZF9pZCIsImVtYWlsIjoidmFsaWRfZW1haWxAZXhhbXBsZS5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.sLgDN9EDr-SLRNML0eBdfzkfV0MkJRTiKeoxO80omhk',
      },
    };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(next).toHaveBeenCalled();

    expect(req.user).toEqual({
      id: 'valid_id',
      email: 'valid_email@example.com',
    });
  });

  it('should  return UNAUTHORIZED if authorization header is present and invalid', () => {
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
      responseMessage: 'Unauthorized',
    });
  });

  it('should return UNAUTHORIZED if authorization header is missing', () => {
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
      responseMessage: 'Unauthorized',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return UNAUTHORIZED if authorization header is invalid', () => {
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
      responseMessage: 'Unauthorized',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
