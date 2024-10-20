import { User } from '@prisma/client';
import { Request } from 'express';

export interface IRequest extends Request {
  user?: {
    role: {
      id: number;
      createdAt: Date;
      name: string;
      permissions: string[];
    };
  } & {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    roleId: number | null;
    createdAt: Date;
  };
}
