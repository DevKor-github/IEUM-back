import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/repositories/user.repository';
import { User } from 'src/entities/user.entity';
import { UserLoginResDto } from './dtos/user-login-res.dto';
import { NotValidRefreshException } from 'src/common/exceptions/auth.exception';
import { v4 as uuidv4 } from 'uuid';
import { OAuthPlatform } from 'src/common/enums/oAuth-platform.enum';
import * as jwt from 'jsonwebtoken';
import { AppleNotificationPayload } from 'src/common/interfaces/apple-notification-jwt-format.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
  ) {}

  //AccessToken 발급
  getAccessToken(user: User) {
    return this.jwtService.sign(
      {
        id: user.id,
        oAuthId: user.oAuthId,
      },
      { secret: process.env.SECRET_KEY_ACCESS, expiresIn: '12h' },
    );
  }

  //refreshToken 발급
  async getRefreshToken(user: User) {
    //jti를 사용한 refreshToken에 unique id 부여.
    const jti = uuidv4();
    const refreshToken = this.jwtService.sign(
      {
        id: user.id,
        oAuthId: user.oAuthId,
        jti: jti,
      },
      { secret: process.env.SECRET_KEY_REFRESH, expiresIn: '180d' },
    );

    await this.userRepository.renewRefreshToken(user.id, jti);

    return refreshToken;
  }

  //AccessToken 재발급
  async newAccessToken(id: number, jti: string) {
    const user = await this.userRepository.findUserById(id);

    //refreshToken이 해당 유저의 refreshtoken이 맞는지 체크
    const isRefreshTokenMatch = jti == user.jti;
    if (!isRefreshTokenMatch) {
      throw new NotValidRefreshException('refresh 토큰이 유효하지 않습니다.');
    }
    const newAccessToken = this.getAccessToken(user);

    return {
      accessToken: newAccessToken,
    };
  }

  //-------------------------소셜 로그인 ---------------------------
  async socialLogin(
    oAuthId: string,
    oAuthPlatform: OAuthPlatform,
  ): Promise<UserLoginResDto> {
    const user = await this.userRepository.findUserByOAuthIdAndPlatform(
      oAuthId,
      oAuthPlatform,
    );

    //만약 계정이 존재한다면
    if (user) {
      const accessToken = this.getAccessToken(user);
      const refreshToken = await this.getRefreshToken(user);
      return UserLoginResDto.fromCreation(
        user.uuid,
        user.oAuthPlatform,
        accessToken,
        refreshToken,
      );
    }

    //계정이 없다면 새로 추가
    const newUser = await this.userRepository.socialSignIn(
      oAuthId,
      oAuthPlatform,
    );
    const accessToken = this.getAccessToken(newUser);
    const refreshToken = await this.getRefreshToken(newUser);
    return UserLoginResDto.fromCreation(
      newUser.uuid,
      newUser.oAuthPlatform,
      accessToken,
      refreshToken,
    );
  }

  async handleAppleNotification(payload: string) {
    const decodedToken = jwt.decode(payload) as AppleNotificationPayload;

    decodedToken.events.map(async (event) => {
      switch (event.type) {
        case 'email-disabled':
          console.log('email-disabled');
          break;
        case 'email-enabled':
          console.log('email-enabled');
          break;
        case 'consent-revoked' || 'account-delete':
          console.log('유저가 애플 ID 연동을 해제');
          console.log('유저가 apple ID를 삭제했을 때');
          const userToDelete =
            await this.userRepository.findUserByOAuthIdAndPlatform(
              event.sub,
              OAuthPlatform.Apple,
            );
          if (userToDelete) {
            await this.userService.deleteUser(userToDelete.id);
          }
          break;
        default:
          console.log('알 수 없는 요청:' + event.type);
          break;
      }
    });
  }
}
