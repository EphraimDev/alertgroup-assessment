import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { LoggerUtils } from '../../src/utils/logger.util';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly loggerUtils: LoggerUtils,
  ) {}

  async catch(exception: any, host: ArgumentsHost): Promise<void> {
    const { httpAdapter } = this.httpAdapterHost;

    let context: any;
    try {
      context = host.switchToHttp();
    } catch (error) {
      console.log(error);
      this.loggerUtils
        .logger(module)
        .error(`Failed to switch to HTTP context:, ${error?.message}`);
    }

    const req = context?.getRequest();
    const res = context?.getResponse();

    const ipAddress =
      req?.ip || req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress;

    const httpStatusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let responseData: any = exception?.message || 'Internal Server Error'; // Default message

    if (exception instanceof Error) {
      responseData = exception.message;
    } else if (typeof exception === 'string') {
      responseData = exception;
    }

    if (!responseData?.message) {
      responseData = { message: responseData };
    }

    let requestBody = { ...req.body, ...req.query, ...req.params };
    if (requestBody.password) delete requestBody.password;
    if (requestBody.confirmPassword) delete requestBody.confirmPassword;

    this.loggerUtils
      .logger(module)
      .info(
        `${httpStatusCode} - ${req.method} - ${ipAddress}- ${req.originalUrl} - ${JSON.stringify(requestBody)} - ${
          httpStatusCode >= 400 ? JSON.stringify(responseData) : 'success'
        }`,
      );
    // Handle context potentially being unavailable
    if (res) {
      httpAdapter.reply(context?.getResponse(), responseData, httpStatusCode);
    } else {
      console.log(exception);
      this.loggerUtils
        .logger(module)
        .error('Failed to send response due to unavailable context');
    }
  }
}
