import { IsDateString, IsString } from 'class-validator';

export class CreateCatDto {
  @IsString()
  readonly name: string;

  @IsDateString()
  readonly birthday: string;

  @IsString()
  readonly breed: string;
}
