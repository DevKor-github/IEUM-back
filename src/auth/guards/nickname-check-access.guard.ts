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
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new UnauthorizedException('customguard test');
    }
    // const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('customguard test');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY_ACCESS,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
      const requestUser = await this.userService.getUserById(payload.id);
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
