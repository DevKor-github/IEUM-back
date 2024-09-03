import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiIeumExceptionRes } from 'src/common/decorators/api-ieum-exception-res.decorator';
import { throwIeumException } from 'src/common/utils/exception.util';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throwIeumException('LOGIN_REQUIRED');
    }
    if (!token) {
      throwIeumException('LOGIN_REQUIRED');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY_REFRESH,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.user = payload;
    } catch {
      throwIeumException('LOGIN_REQUIRED');
    }
    return true;
  }
}

export function UseRefreshGuard() {
  return applyDecorators(
    UseGuards(RefreshGuard),
    ApiBearerAuth('refresh-token'),
    ApiIeumExceptionRes(['LOGIN_REQUIRED']),
  );
}
