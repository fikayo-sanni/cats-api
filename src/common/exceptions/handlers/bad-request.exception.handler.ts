import { StatusCodes } from '../constants/status-codes.contants';
import { BaseAppException } from './base.exception.handler';
import { HttpStatus } from '@nestjs/common';

type BaseAppExceptionConstructorParams = ConstructorParameters<
  typeof BaseAppException
>;

export class BadRequestAppException extends BaseAppException {
  constructor(
    message: BaseAppExceptionConstructorParams[0],
    statusCode = StatusCodes.BAD_REQUEST,
    devMessage: BaseAppExceptionConstructorParams[4] = undefined,
    translateMessage = true,
  ) {
    super(
      message,
      HttpStatus.BAD_REQUEST,
      statusCode,
      translateMessage,
      devMessage,
    );
  }
}
