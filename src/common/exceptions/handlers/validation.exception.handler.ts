import { StatusCodes } from '../constants/status-codes.contants';
import { BaseAppException } from './base.exception.handler';
import { HttpStatus } from '@nestjs/common';

type BaseAppExceptionConstructorParams = ConstructorParameters<
  typeof BaseAppException
>;

export class ValidationAppException extends BaseAppException {
  errors: Record<string, string> | undefined;

  constructor(
    message: BaseAppExceptionConstructorParams[0],
    errors?: Record<string, any>,
    devMessage: BaseAppExceptionConstructorParams[4] = undefined,
    translateMessage = true,
  ) {
    super(
      message,
      HttpStatus.PRECONDITION_FAILED,
      StatusCodes.VALIDATION_FAILED,
      translateMessage,
      devMessage,
    );
    this.errors = errors;
  }
}
