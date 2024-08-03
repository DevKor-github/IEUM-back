import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { CustomException } from '../exceptions/custom.exception';
import {
  DefaultBadRequestException,
  DefaultForbiddenException,
  DefaultInternalServerErrorException,
  DefaultUnauthorizedException,
  DefaultUndefinedException,
} from '../exceptions/default.exception';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let processedException: any;

    if (exception instanceof CustomException) {
      processedException = exception;
    } else if (exception instanceof HttpException) {
      processedException = this.handleHttpException(exception);
    } else if (exception instanceof Error) {
      processedException = new DefaultInternalServerErrorException(
        exception.message,
      );
    } else {
      processedException = new DefaultUndefinedException(
        '알 수 없는 에러 발생.',
      );
    }

    const { errorCode, message } = processedException;

    response.json({
      statusCode: errorCode,
      message: message,
    });
  }

  private handleHttpException(exception: HttpException): CustomException {
    switch (exception.getStatus()) {
      case 400:
        return new DefaultBadRequestException(
          this.getResponseMessage(exception),
        );
      case 401:
        return new DefaultUnauthorizedException(
          this.getResponseMessage(exception),
        );
      case 403:
        return new DefaultForbiddenException(
          this.getResponseMessage(exception),
        );
      default:
        return new DefaultUndefinedException(
          this.getResponseMessage(exception),
        );
    }
  }

  private getResponseMessage(exception: HttpException): string {
    const response = exception.getResponse();
    return typeof response === 'object' ? (response as any).message : response;
  }
}
