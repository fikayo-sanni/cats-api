import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { request_blacklist, stripAttributes } from '../utils/blacklist.util';

@Injectable()
export class RequestBodyPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Modify the incoming request data here
    if (metadata.type === 'body') {
      value = stripAttributes(value, request_blacklist)
    }
    return value;
  }
}