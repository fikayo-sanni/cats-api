import { HttpStatus, Injectable, Scope } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { StatusCodes } from '../exceptions/constants/status-codes.contants';
import { BaseAppException } from '../exceptions';
import { Request, Response } from 'express';
import appConfig from '../config/envs/app.config';
import { get } from 'lodash';
import { ForbiddenAppException } from '../exceptions/handlers/forbidden.exception.handler';
import { response_blacklist, stripAttributes } from './blacklist.util';

@Injectable({ scope: Scope.TRANSIENT })
export class HttpResponse {
  constructor(private readonly moduleRef: ModuleRef) {
  }

  //Vars
  private serverCode: HttpStatus = HttpStatus.OK;
  private statusCode = StatusCodes.SUCCESS;
  private message = '';
  private devMessage = '';
  private data: unknown = null;
  private dataKey = 'data';

  setMessage(message: string) {
    this.message = message;
    return this;
  }

  setData(data: unknown) {

    this.data = stripAttributes(data, response_blacklist);
    return this;
  }

  setDataKey(dataKey: string) {
    this.dataKey = dataKey;
    return this;
  }

  setDataWithKey(dataKey: string, data: unknown) {
    try {
      this.dataKey = dataKey;
      this.data = stripAttributes(data, response_blacklist);
      return this;
    } catch (e) {
      throw new ForbiddenAppException(e.message);
    }
  }

  setAuthDataWithKey(dataKey: string, data: unknown) {
    this.dataKey = dataKey;
    this.data = data;
    return this;
  }

  setServerCode(serverCode: number) {
    this.serverCode = serverCode;
    return this;
  }

  setStatusCode(statusCode: StatusCodes) {
    this.statusCode = statusCode;
    return this;
  }

  send(res: Response) {
    return res.status(this.serverCode).send(this.buildResponseBody());
  }

  sendResponseBody(res: Response, body: any) {

    body = stripAttributes(body, response_blacklist);

    return res
      .status(this.serverCode)
      .send({ statusCode: this.statusCode, message: this.message, ...body });
  }

  getBody() {
    return this.buildResponseBody();
  }

  private buildResponseBody() {
    const appconfiguration = appConfig();
    const response: Record<string, unknown> = { statusCode: this.statusCode };
    response[this.dataKey] = this.data;

    response['message'] = this.message;
    if (appconfiguration.NODE_ENV !== 'production') {
      response['devMessage'] = this.devMessage;
    } else {
      response['devMessage'] = null;
    }
    return response;
  }

  sendException(
    exception: BaseAppException,
    req: Request,
    res: Response,
    errors?: Record<string, any>,
  ) {
    const response: Record<string, unknown> = {
      data: null,
      statusCode: exception.statusCode,
    };

    response['message'] = exception.message;

    if (process.env.NODE_ENV !== 'production') {
      response['devMessage'] = exception.devMessage ?? exception.stack;
    } else {
      response['devMessage'] = null;
    }

    // Include validation errors if present
    if (errors) {
      response['errors'] = errors;
    }

    return res.status(exception.getStatus()).send(response);
  }

  sendNotHandledException(exception: Error, req: Request, res: Response) {
    const appconfiguration = appConfig();
    const response: Record<string, unknown> = { data: null };

    if (appconfiguration.NODE_ENV !== 'production') {
      response['devMessage'] = exception.stack ?? null;
    } else {
      response['devMessage'] = null;
    }

    const statusCode =
      (get(
        exception,
        'status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ) as HttpStatus) || HttpStatus.INTERNAL_SERVER_ERROR;

    if (statusCode === HttpStatus.TOO_MANY_REQUESTS) {
      response['statusCode'] = StatusCodes.TOO_MANY_REQUESTS;
    } else if (statusCode == HttpStatus.NOT_FOUND) {
      response['statusCode'] = StatusCodes.PAGE_NOT_FOUND;
    } else {
      response['statusCode'] = StatusCodes.SERVER_ERROR;
    }
    return res.status(statusCode).send(response);
  }
}