import { User } from '@prisma/client';
import { Request } from 'express';

export interface CustomRequest extends Request {
  email: string;
  name: string;
  picture_url: string;
  id: string;
}
