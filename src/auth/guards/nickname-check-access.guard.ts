import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiIeumExceptionRes } from 'src/common/decorators/api-ieum-exception-res.decorator';
import { throwIeumException } from 'src/common/utils/exception.util';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NicknameCheckingAccessGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

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

export function UseNicknameCheckingAccessGuard() {
  return applyDecorators(
    UseGuards(NicknameCheckingAccessGuard),
    ApiBearerAuth('access-token'),
    ApiIeumExceptionRes(['LOGIN_REQUIRED', 'USERINFO_FILL_REQUIRED']),
  );
}
