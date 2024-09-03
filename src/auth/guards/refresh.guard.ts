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
    if (!request.headers.authorization) {
      throwIeumException('MISSING_AUTHORIZATION_HEADER');
    }
    if (type !== 'Bearer') {
      throwIeumException('INVALID_TOKEN_TYPE');
    }
    if (!token) {
      throwIeumException('MISSING_TOKEN');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY_REFRESH,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.user = payload;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throwIeumException('REFRESH_TOKEN_EXPIRED');
      } else if (error.name === 'JsonWebTokenError') {
        throwIeumException('INVALID_REFRESH_TOKEN');
      } else {
        throwIeumException('REFRESH_VERIFICATION_FAILED');
      }
    }
    return true;
  }
}

export function UseRefreshGuard() {
  return applyDecorators(
    UseGuards(RefreshGuard),
    ApiBearerAuth('refresh-token'),
    ApiIeumExceptionRes([
      'MISSING_AUTHORIZATION_HEADER',
      'INVALID_TOKEN_TYPE',
      'MISSING_TOKEN',
      'REFRESH_TOKEN_EXPIRED',
      'INVALID_REFRESH_TOKEN',
      'REFRESH_VERIFICATION_FAILED',
    ]),
  );
}
