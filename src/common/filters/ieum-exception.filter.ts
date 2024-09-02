import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { IeumException } from '../utils/exception.util';

@Catch()
export class IeumExceptionFilter implements ExceptionFilter {
  catch(exception: IeumException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const { statusCode, errorCode, name, message } = exception;
    response.status(statusCode).json({
      statusCode,
      errorCode,
      name,
      message,
    });
  }
}
