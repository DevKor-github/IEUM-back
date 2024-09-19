import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { IeumException } from '../utils/exception.util';
import { winstonLogger } from '../logger/winston.logger';
import { identity } from 'rxjs';

@Catch(IeumException)
export class IeumExceptionFilter implements ExceptionFilter {
  // private readonly logger = new Logger(IeumExceptionFilter.name);
  catch(exception: IeumException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();
    const { method, originalUrl, query, body, ip } = request;
    const user = (request.user as { id: number; oAuthId: string }) ?? null;
    const { statusCode, errorCode, name, message } = exception;
    response.status(statusCode).json({
      statusCode,
      errorCode,
      name,
      message,
    });

    //이음 자체 에러 : log level warn으로 분류.
    const warnLogMessage = {
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
    };
    winstonLogger.warn(warnLogMessage);

    // this.logger.error(exception);
  }
}
