import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { winstonLogger } from '../logger/winston.logger';

@Catch()
export class UndefinedExceptionFilter implements ExceptionFilter {
  // private readonly logger = new Logger(UndefinedExceptionFilter.name);
  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();
    const { method, originalUrl, query, body, ip } = request;
    const user = (request.user as { id: number; oAuthId: string }) ?? null;

    let statusCode = 500;
    const errorCode = 9999;
    let name = 'INTERNAL_SERVER_ERROR';
    const message = '알 수 없는 에러가 발생했습니다.';
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      name = `UNDEFINED : ${exception.name}`;
    } else if (exception instanceof Error) {
      name = `UNDEFINED : ${exception.name}`;
      // console.error(exception);
    }

    response.status(statusCode).json({
      statusCode,
      errorCode,
      name,
      message,
      stack: exception.stack,
    });

    //알 수 없는 에러 : log level error로 분류
    const errorLogMessage = {
      app: 'IEUM',
      name: name,
      message: message,
      errorCode: errorCode,
      userId: user?.id,
      method: method,
      endpoint: originalUrl,
      statusCode: statusCode,
      ip: ip,
      query: query,
      body: body,
      stack: exception.stack,
    };
    winstonLogger.error(errorLogMessage);

    // this.logger.error(exception);
  }
}
