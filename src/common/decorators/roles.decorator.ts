import { Reflector } from '@nestjs/core';
import { UserRole } from '../types/user.types';

export const Roles = Reflector.createDecorator<UserRole[]>();
