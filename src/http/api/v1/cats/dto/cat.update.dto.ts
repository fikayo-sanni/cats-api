import { PartialType } from '@nestjs/mapped-types';
import { CreateCatDto } from './cat.create.dto';

export class UpdateCatDto extends PartialType(CreateCatDto) {}