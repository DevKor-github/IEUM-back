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
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(user);
    if (user) {
      return true;
    } else {
      throwIeumException('NOT_VALID_USER');
    }
  }
}
