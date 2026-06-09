import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let errors: any[] = [];

    if (exception instanceof HttpException) {
      const resContent: any = exception.getResponse();
      if (typeof resContent === 'object' && resContent !== null) {
        message = resContent.message || exception.message;
        if (Array.isArray(resContent.message)) {
          errors = resContent.message;
          message = resContent.message[0] || exception.message;
        } else if (resContent.error) {
          errors = [resContent.error];
        }
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errors = [exception.stack || exception.name];
    }

    response.status(status).json({
      success: false,
      message,
      data: null,
      errors,
    });
  }
}
