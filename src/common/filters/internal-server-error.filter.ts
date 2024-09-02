import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class InternalServerErrorFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(500).json({
      statusCode: 500,
      errorCode: 9999,
      name: exception.name,
      message: `${exception.message}\n${exception.stack}`,
    });
  }
}
