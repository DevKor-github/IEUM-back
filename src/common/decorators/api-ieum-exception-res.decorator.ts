import { applyDecorators } from '@nestjs/common';
import { IeumException, ieumExceptions } from '../utils/exception.util';
import {
  ApiExtraModels,
  ApiResponse,
  ApiResponseOptions,
} from '@nestjs/swagger';

export function ApiIeumExceptionRes(names: (keyof typeof ieumExceptions)[]) {
  const ieumExceptionResOptions: Record<number, ApiResponseOptions> = {};

  names.map((name) => {
    const ieumException = ieumExceptions[name];
    const statusCode = ieumException.statusCode;
    if (ieumExceptionResOptions[statusCode]) {
      ieumExceptionResOptions[statusCode].content['application/json'].examples =
        {
          ...ieumExceptionResOptions[statusCode].content['application/json']
            .examples,
          [name]: { value: ieumException },
        };
    } else {
      ieumExceptionResOptions[statusCode] = {
        status: statusCode,
        content: {
          'application/json': {
            examples: {
              [name]: { value: ieumException },
            },
          },
        },
      };
    }
  });

  const apiResponseDecorators = Object.keys(ieumExceptionResOptions).map(
    (statusCode) => {
      return ApiResponse(ieumExceptionResOptions[statusCode]);
    },
  );

  return applyDecorators(
    ApiExtraModels(IeumException),
    ...apiResponseDecorators,
  );
}
