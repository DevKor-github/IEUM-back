import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NicknameCheckingAccessGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    try {
      const requestUser = await this.userService.getUserById(user.id);
      console.log(requestUser);
      if (requestUser.nickname == null) {
        throw new ForbiddenException(
          '회원 가입 절차 끝나지 않음. 사용자 추가 정보 기입 필요.',
        );
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
