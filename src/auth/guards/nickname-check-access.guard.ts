import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { throwIeumException } from 'src/common/utils/exception.util';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NicknameCheckingAccessGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throwIeumException('LOGIN_REQUIRED');
    }
    const requestUser = await this.userService.getUserById(user.id);
    if (requestUser.nickname == null) {
      throwIeumException('USERINFO_FILL_REQUIRED');
    }
    return true;
  }
}
