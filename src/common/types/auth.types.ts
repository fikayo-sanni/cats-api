import { UserRole } from "./user.types";

export const IS_PUBLIC_KEY = 'isPublic';
export interface AuthRequest extends Request {
  user: JwtPayload;
}

export interface JwtPayload {
  sub: string;
  roles: Array<UserRole>;
}
