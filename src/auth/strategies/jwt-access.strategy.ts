import { ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from 'src/user/repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
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
