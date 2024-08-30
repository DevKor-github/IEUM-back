import { ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from 'src/user/repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';

export class JwtAccessNicknameCheckStrategy extends PassportStrategy(
  Strategy,
  'NCaccess',
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY_ACCESS,
    });
  }
  async validate(payload) {
    console.log(payload);

    const requestUser = await this.userService.getUserById(payload.id);
    console.log(requestUser);
    if (requestUser.nickname == null) {
      throw new ForbiddenException(
        '회원 가입 절차 끝나지 않음. 사용자 추가 정보 기입 필요.',
      );
    }

    console.log(payload.id);
    return {
      id: payload.id,
      oAuthId: payload.oAuthId,
    };
  }
}
