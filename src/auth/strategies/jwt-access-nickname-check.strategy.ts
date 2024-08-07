import { ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from 'src/repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';

export class JwtAccessNicknameCheckStrategy extends PassportStrategy(
  Strategy,
  'NCaccess',
) {
  constructor(
    //passport는 nestjs의 의존성 주입 시스템을 직접적으로 사용하지 않기 때문에 직접 명시 해주어야만 작동함.
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY_ACCESS,
    });
  }
  async validate(payload) {
    console.log(payload);

    const requestUser = await this.userRepository.findUserById(payload.id);
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
