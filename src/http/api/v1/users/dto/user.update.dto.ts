import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './user.create.dto';
import { UserRole } from 'src/common/types/user.types';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    refresh_token?: string;
    roles?: UserRole[];
}