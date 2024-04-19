import { HttpException } from '@nestjs/common';
import { StatusCodes } from '../constants/status-codes.contants';

type HttpExceptionConstructorParams = ConstructorParameters<
  typeof HttpException
>;

export class BaseAppException extends HttpException {
  statusCode: StatusCodes;
  translateMessage: boolean;
  devMessage?: unknown;

  constructor(
    message: HttpExceptionConstructorParams[0],
    status: HttpExceptionConstructorParams[1],
    statusCode: StatusCodes,
    translateMessage: boolean,
    devMessage: string | unknown | undefined = undefined,
  ) {
    super(message, status);
    this.statusCode = statusCode;
    this.translateMessage = translateMessage;
    this.devMessage =
      typeof devMessage === 'object'
        ? JSON.stringify(devMessage)
        : devMessage
          ? devMessage.toString()
          : devMessage;
  }
}
