import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpResponse } from 'src/common/utils/http.util';
import { BaseAppException } from '../handlers/base.exception.handler';
import { ModuleRef } from '@nestjs/core';
import { ValidationAppException } from '../handlers/validation.exception.handler';
import { get, isObject, isString, omit } from 'lodash';
import { AppLogger } from 'src/common/utils/logger.util';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private moduleRef: ModuleRef,
    private readonly appLogger: AppLogger
  ) {}

  async catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const httpResponse: HttpResponse = new HttpResponse(this.moduleRef);

    if (exception instanceof BaseAppException) {

      if (exception instanceof ValidationAppException) {
        // You might need to modify sendException to handle this `errors` property
        return httpResponse.sendException(
          exception,
          request,
          response,
          exception.errors,
        );
      }

      const exceptionResponse = exception.getResponse();
      if (!exception.message) {
        if (isString(exceptionResponse)) {
          exception.message = exceptionResponse.toString();
        }

        const message = get(exceptionResponse, 'message');
        if (isObject(exceptionResponse) && isString(message)) {
          exception.message = message;
        }
      }

      this.appLogger.logError(exception)
      return httpResponse.sendException(
        exception,
        request,
        response,
        isObject(exceptionResponse) ? omit(exceptionResponse, ['message']) : {},
      );
    } else {
      this.appLogger.logError(exception);
      return httpResponse.sendNotHandledException(exception, request, response);
    }
  }
}
