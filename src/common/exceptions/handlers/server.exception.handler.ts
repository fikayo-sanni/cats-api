import { StatusCodes } from '../constants/status-codes.contants';
import { BaseAppException } from './base.exception.handler';
import { HttpStatus } from '@nestjs/common';

type BaseAppExceptionConstructorParams = ConstructorParameters<
  typeof BaseAppException
>;

export class ServerAppException extends BaseAppException {
  constructor(
    message: BaseAppExceptionConstructorParams[0],
    devMessage: BaseAppExceptionConstructorParams[4] = '',
    translateMessage = true,
  ) {
    super(
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      StatusCodes.SERVER_ERROR,
      translateMessage,
      devMessage,
    );
  }
}
