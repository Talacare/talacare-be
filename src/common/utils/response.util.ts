import { Injectable, Logger } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { ResponseInterface } from './response.interface';

@Injectable()
export class ResponseUtil {
  response(
    { responseCode, responseMessage, responseStatus }: ResponseInterface,
    data?: any,
  ) {
    const responsePayload = {
      responseMessage: responseMessage || 'Data retrieved successfully',
      responseCode: responseCode || HttpStatus.OK,
      responseStatus: responseStatus || 'SUCCESS',
      ...data,
    };

    Logger.log(responsePayload, `Response Body`);

    return responsePayload;
  }
}
