import { IsString } from 'class-validator';
import { UpdateUserDto } from './user.update.dto';

export class CleanUserUpdateDto  implements Omit<UpdateUserDto, 'password' | 'email' | 'refresh_token'>{
    @IsString()
    first_name?: string;

    @IsString()
    last_name?: string;
}
