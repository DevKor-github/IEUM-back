import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch()
export class UndefinedExceptionFilter implements ExceptionFilter {
  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    let statusCode = 500;
    let errorCode = 9999;
    let name = 'INTERNAL_SERVER_ERROR';
    let message = '알 수 없는 에러가 발생했습니다.';
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      name = `UNDEFINED : ${exception.name}`;
    } else if (exception instanceof Error) {
      name = `UNDEFINED : ${exception.name}`;
      console.error(exception);
    }

    response.status(statusCode).json({
      statusCode,
      errorCode,
      name,
      message,
      stack: exception.stack,
    });
  }
}
