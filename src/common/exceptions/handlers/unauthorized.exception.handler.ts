import { StatusCodes } from '../constants/status-codes.contants';
import { BaseAppException } from './base.exception.handler';
import { HttpStatus } from '@nestjs/common';

type BaseAppExceptionConstructorParams = ConstructorParameters<
  typeof BaseAppException
>;

export class UnAuthorizedAppException extends BaseAppException {
  constructor(
    message: BaseAppExceptionConstructorParams[0],
    devMessage: BaseAppExceptionConstructorParams[4] = undefined,
    translateMessage = true,
  ) {
    super(
      message,
      HttpStatus.UNAUTHORIZED,
      StatusCodes.UNAUTHORIZED,
      translateMessage,
      devMessage,
    );
  }
}
