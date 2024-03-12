import { HttpStatus } from '@nestjs/common';

export interface ResponseInterface {
  responseMessage?: string;
  responseCode?: HttpStatus;
  responseStatus?: 'SUCCESS' | 'FAILED';
}
