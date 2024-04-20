import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { BadRequestAppException } from '../exceptions'
import { ResponseMessages } from '../exceptions/constants/messages.constants';

@Injectable()
export class PaginationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'query') {
      return value;
    }

    if (value?.page < 1) {
      throw new BadRequestAppException(ResponseMessages.INVALID_PAGE_PARAMS);
    }

    const page =
      value?.page && Number(value.page) > 0 ? Number(value.page) : undefined;
    value.take =
      value?.pageSize && Number(value.pageSize) > 0
        ? Number(value.pageSize)
        : page
        ? 15
        : undefined;
    value.skip = value.take ? (page - 1) * value.take : undefined;
    delete value.page, delete value.pageSize;
    return value;
  }
}
