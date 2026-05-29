import {
  ArgumentsHost,
  ExceptionFilter,
  Catch,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UnauthorizedException } from 'src/auth/core/errors/UnauthorizedException';
import { ResourceAlreadyExistsException } from 'src/errors/ResourceAlreadyExistsException';
import { ResourceInvalidException } from 'src/errors/ResourceInvalidException';
import { ResourceNotFoundException } from 'src/errors/ResourceNotFoundException';

@Catch(Error)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof ResourceAlreadyExistsException) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    } else if (exception instanceof ResourceInvalidException) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof ResourceNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    } else if (exception instanceof UnauthorizedException) {
      status = HttpStatus.UNAUTHORIZED;
      message = exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
