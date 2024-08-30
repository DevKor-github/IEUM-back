import { ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from 'src/user/repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
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

    return {
      id: payload.id,
      oAuthId: payload.oAuthId,
    };
  }
}
