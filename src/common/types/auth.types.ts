import { UserRole } from "./user.types";
import { Request } from 'express';

export const IS_PUBLIC_KEY = 'isPublic';
export interface IAuthRequest extends Request {
  user: IJwtPayload;
}

export interface IJwtPayload {
  sub: number;
  roles: Array<UserRole>;
}
