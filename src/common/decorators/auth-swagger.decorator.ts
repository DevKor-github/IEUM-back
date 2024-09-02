import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccessGuard } from 'src/auth/guards/access.guard';

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
    UseGuards(AccessGuard),
    ApiBearerAuth('Access Token'),
    ApiOperation({ summary: options.summary }),
    ApiResponse({
      status: options.status,
      description: options.description,
      type: options.type,
    }),
  );
}
