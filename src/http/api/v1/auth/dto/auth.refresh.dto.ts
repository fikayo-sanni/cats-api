import { IsJWT, IsString } from 'class-validator';

export class RefreshAuthDto {
  @IsString()
  @IsJWT()
  readonly refresh_token: string;
}
