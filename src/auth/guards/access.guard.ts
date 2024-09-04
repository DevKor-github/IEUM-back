import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiIeumExceptionRes } from 'src/common/decorators/api-ieum-exception-res.decorator';
import { throwIeumException } from 'src/common/utils/exception.util';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throwIeumException('LOGIN_REQUIRED');
    }
    return true;
  }
}

export function UseAccessGuard() {
  return applyDecorators(
    UseGuards(AccessGuard),
    ApiBearerAuth('access-token'),
    ApiIeumExceptionRes(['LOGIN_REQUIRED']),
  );
}
