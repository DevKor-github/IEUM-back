import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY_REFRESH,
    });
  }

  validate(payload) {
    console.log(payload);
    return {
      id: payload.id,
      oAuthId: payload.oAuthId,
      jti: payload.jti,
    };
  }
}
