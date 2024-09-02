import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IeumException,
  throwIeumException,
} from 'src/common/utils/exception.util';

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
