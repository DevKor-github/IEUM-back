import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    req.user = null;
    if (type === 'Bearer') {
      if (token) {
        try {
          const payload = await this.jwtService.verifyAsync(token, {
            secret: process.env.SECRET_KEY_ACCESS,
          });
          req.user = {
            id: payload.id,
            oAuthId: payload.oAuthId,
            jti: payload.jti,
          };
        } catch (error) {}
      }
    }
    console.log('middleware');
    return next();
  }
}
