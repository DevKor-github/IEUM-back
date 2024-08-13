import { applyDecorators } from '@nestjs/common';

import { ErrorCodeEnum } from '../enums/error-code.enum';
import { ApiResponse } from '@nestjs/swagger';

interface ErrorResponse {
  statusCode: ErrorCodeEnum;
  message: string;
}

export function CustomErrorResSwaggerDecorator(
  errorResponses: ErrorResponse[],
) {
  const decorators = errorResponses.map((errorResponse) =>
    ApiResponse({
      status: errorResponse.statusCode,
      description: errorResponse.message,
    }),
  );
  return applyDecorators(...decorators);
}
