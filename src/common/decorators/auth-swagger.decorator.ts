import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

interface CustomAuthSwaggerDecoratorOptions {
  summary: string;
  status?: number;
  description?: string;
  type?: any;
}

export function CustomAuthSwaggerDecorator(
  options: CustomAuthSwaggerDecoratorOptions,
) {
  return applyDecorators(
    //UseGuards(AuthGuard('access')),
    ApiBearerAuth('Access Token'),
    ApiOperation({ summary: options.summary }),
    ApiResponse({
      status: options.status,
      description: options.description,
      type: options.type,
    }),
  );
}
