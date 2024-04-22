import { IsString } from 'class-validator';

export class ChangePasswordAuthDto {
  @IsString()
  readonly password: string;
}
