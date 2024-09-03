import { applyDecorators } from '@nestjs/common';
import { IeumException, ieumExceptions } from '../utils/exception.util';
import {
  ApiExtraModels,
  ApiResponse,
  ApiResponseOptions,
} from '@nestjs/swagger';

export function ApiIeumExceptionRes(names: [keyof typeof ieumExceptions]) {
  const ieumExceptionResOptions: Record<string, ApiResponseOptions> =
    Object.fromEntries(
      names.map((name) => {
        const ieumException = ieumExceptions[name];
        const apiResponseOptions: ApiResponseOptions = {
          status: ieumException.statusCode,
          content: {
            'application/json': {
              example: ieumException,
            },
          },
        };
        return [name, apiResponseOptions];
      }),
    );

  const apiResponseDecorators = Object.keys(ieumExceptionResOptions).map(
    (name) => {
      return ApiResponse(ieumExceptionResOptions[name]);
    },
  );

  return applyDecorators(
    ApiExtraModels(IeumException),
    ...apiResponseDecorators,
  );
}
