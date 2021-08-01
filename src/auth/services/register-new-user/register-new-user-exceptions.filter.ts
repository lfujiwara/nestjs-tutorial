import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { RegisterNewUserServiceError } from './register-new-user.service.errors';
import { RegisterNewUserServiceErrors } from './register-new-user.service';
import { ValidationError } from 'joi';

@Catch(RegisterNewUserServiceError, ValidationError)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(
    exception: RegisterNewUserServiceError | ValidationError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let statusCode: number;
    let data: any;
    let errorCode: string;

    if (exception instanceof RegisterNewUserServiceError) {
      errorCode = exception.message;
      switch (exception.message) {
        case RegisterNewUserServiceErrors.EMAIL_ALREADY_REGISTERED:
        case RegisterNewUserServiceErrors.USERNAME_ALREADY_REGISTERED:
          statusCode = HttpStatus.CONFLICT;
          break;
        default:
          statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      }
    }

    if (exception instanceof ValidationError) {
      errorCode = 'ValidationError';
      statusCode = HttpStatus.BAD_REQUEST;
      data = exception.details;
    }

    response.status(statusCode).json({
      statusCode,
      errorCode,
      data,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
