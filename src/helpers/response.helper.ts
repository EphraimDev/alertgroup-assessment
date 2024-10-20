import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Injectable,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
} from '@nestjs/common';
import { LoggerUtils } from 'src/utils/logger.util';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  //private readonly logger = new Logger('ResponseLogger');

  constructor(private readonly loggerUtils: LoggerUtils) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (data) => {
        return await this.handleResponse(context, data);
      }),
    );
  }

  private async handleResponse(
    context: ExecutionContext,
    data: any,
    httpStatusCode?: any,
  ) {
    if (context.getType() === 'http') {
      const req = context.switchToHttp().getRequest();
      const res = context.switchToHttp().getResponse();
      const ipAddress =
        req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const statusCode = httpStatusCode || res.statusCode;

      let requestBody = { ...req.body, ...req.query, ...req.params };
      if (requestBody.password) delete requestBody.password;
      if (requestBody.confirmPassword) delete requestBody.confirmPassword;

      let responseDataAsString = JSON.stringify(requestBody);

      this.loggerUtils
        .logger(module)
        .info(
          `${statusCode} - ${req.method} - ${ipAddress}- ${req.originalUrl} - ${JSON.stringify(requestBody)} - ${
            statusCode >= 400 ? responseDataAsString : 'success'
          }`,
        );

      return data;
    }
    return data;
  }
}
