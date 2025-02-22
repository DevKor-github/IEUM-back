import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  NewAccessTokenResDto,
  UserLoginResDto,
} from './dtos/user-login-res.dto';

import { v4 as uuidv4 } from 'uuid';
import { OAuthPlatform } from 'src/common/enums/oAuth-platform.enum';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';

import {
  DecodedAppleIdToken,
  DecodedAppleNotificationToken,
} from 'src/common/interfaces/apple-jwt-format.interface';
import { UserService } from 'src/user/user.service';
import axios from 'axios';
import { KakaoAccessTokenData } from 'src/common/interfaces/kakao-jwt-format.interface';
import { NaverAccessTokenData } from 'src/common/interfaces/naver-jwt-format.interface';
import { User } from 'src/user/entities/user.entity';
import { throwIeumException } from 'src/common/utils/exception.util';
import { SlackAlertService } from 'src/crawling/services/slack-alert.service';

@Injectable()
export class AuthService {
  private jwksClientInstance = jwksClient({
    jwksUri: 'https://appleid.apple.com/auth/keys',
    cache: true, // 캐시 사용 //서버 메모리에 캐싱되는듯?
    cacheMaxEntries: 4, // 최대 4개의 키 캐시
    cacheMaxAge: 600000, // 캐시된 키의 유효 기간 (10분)
  });

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly slackAlertService: SlackAlertService,
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

    await this.userService.renewRefreshToken(user.id, jti);

    return refreshToken;
  }

  //AccessToken 재발급
  async renewAccessToken(
    id: number,
    jti: string,
  ): Promise<NewAccessTokenResDto> {
    const user = await this.userService.getUserById(id);

    //refreshToken이 해당 유저의 refreshtoken이 맞는지 체크
    const isRefreshTokenMatch = jti == user.jti;
    if (!isRefreshTokenMatch) {
      throwIeumException('REFRESH_TOKEN_NOT_MATCHED');
    }
    const newAccessToken = this.getAccessToken(user);

    return new NewAccessTokenResDto(newAccessToken);
  }

  //-------------------------소셜 ---------------------------
  async socialLoginTokenVerification(
    oAuthToken: string,
    oAuthPlatform: OAuthPlatform,
    fcmToken?: string,
  ) {
    let oAuthId: string;
    switch (oAuthPlatform) {
      case OAuthPlatform.Apple:
        oAuthId = await this.verifyAppleIdToken(oAuthToken);
        break;
      case OAuthPlatform.Kakao:
        oAuthId = await this.verifyKakaoAccessToken(oAuthToken);
        break;
      case OAuthPlatform.Naver:
        oAuthId = await this.verifyNaverAccessToken(oAuthToken);
        break;
      default:
        throwIeumException('UNSUPPORTED_OAUTH_PLATFORM');
    }
    return await this.socialLogin(oAuthId, oAuthPlatform, fcmToken);
  }
  async socialLogin(
    oAuthId: string,
    oAuthPlatform: OAuthPlatform,
    fcmToken?: string,
  ): Promise<UserLoginResDto> {
    const user = await this.userService.getUserByOAuthIdAndPlatform(
      oAuthId,
      oAuthPlatform,
    );

    //만약 계정이 존재한다면
    if (user) {
      const accessToken = this.getAccessToken(user);
      const refreshToken = await this.getRefreshToken(user);
      if (fcmToken) {
        await this.userService.updateFCMToken(user.id, fcmToken);
      }
      return new UserLoginResDto(user, accessToken, refreshToken);
    }

    //계정이 없다면 새로 추가
    const newUser = await this.userService.socialLogin(oAuthId, oAuthPlatform);
    const accessToken = this.getAccessToken(newUser);
    const refreshToken = await this.getRefreshToken(newUser);
    if (fcmToken) {
      await this.userService.updateFCMToken(user.id, fcmToken);
    }
    await this.slackAlertService.sendGeneralSlackNotification(
      newUser,
      '유저 정보',
      `새로운 유저 ${newUser.id}님의 회원가입 알람 입니다.`,
    );
    return new UserLoginResDto(newUser, accessToken, refreshToken);
  }

  // ------------------------------------애플 ----------------------------------------------------------
  //애플 kid가 일치하는 public key 가져오기.
  private async getAppleSigningKey(kid: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.jwksClientInstance.getSigningKey(kid, (err, key) => {
        if (err) {
          reject(err); //catch handler로 보냄.
          return;
        }
        const signingKey = key.getPublicKey();
        resolve(signingKey); //에러 발생 안했을 때의 반환 값.
      });
    });
  }

  //IdToken 유효성 검증.
  async verifyAppleIdToken(idToken: string) {
    const decodedToken = jwt.decode(idToken, {
      complete: true,
    }) as DecodedAppleIdToken;

    if (!decodedToken) {
      throwIeumException('INVALID_APPLE_ID_TOKEN');
    }

    const kid = decodedToken.header.kid;
    let signingKey: string;

    //애플 공개키중 kid 일치하는 키 가져오기.
    try {
      signingKey = await this.getAppleSigningKey(kid);
    } catch (error) {
      throwIeumException('APPLE_PUBLIC_KEY_NOT_FOUND');
    }

    //애플 idToken 검증하기
    let oAuthId: string;
    jwt.verify(
      idToken,
      signingKey,
      {
        algorithms: ['RS256'],
      },
      (err, decoded) => {
        if (err) {
          throwIeumException('APPLE_ID_TOKEN_VERIFICATION_FAILED');
          return;
        }
        //토큰 검증 됐을 시
        oAuthId = decodedToken.payload.sub;
      },
    );

    return oAuthId;
  }

  //server-to-server notification token 유효성 검증.
  async handleAppleNotification(payload: string) {
    const decodedToken = jwt.decode(payload, {
      complete: true,
    }) as DecodedAppleNotificationToken;

    console.log(decodedToken);
    const kid = decodedToken.header.kid;
    let signingKey: string;

    //애플 공개키중 kid 일치하는 키 가져오기.
    try {
      signingKey = await this.getAppleSigningKey(kid);
      console.log(signingKey);
    } catch (error) {
      throwIeumException('APPLE_PUBLIC_KEY_NOT_FOUND');
    }

    //애플 공개키로 받은 jwt 검증하고 type에 따라 다른 처리하기.
    let type: string;
    let sub: string;
    jwt.verify(
      payload,
      signingKey,
      {
        algorithms: ['RS256'],
      },
      (err, decoded) => {
        if (err) {
          throwIeumException('APPLE_ID_TOKEN_VERIFICATION_FAILED');
        }
        //토큰 검증 됐을 시
        const jsonEvents = JSON.parse(decodedToken.payload.events);
        type = jsonEvents.type;
        sub = jsonEvents.sub;
      },
    );

    switch (type) {
      case 'email-disabled':
        console.log('email-disabled');
        break;
      case 'email-enabled':
        console.log('email-enabled');
        break;
      case 'consent-revoked':
        console.log('유저가 애플 ID 연동을 해제');
      case 'account-delete':
        console.log('유저가 apple ID를 삭제했을 때');
        const userToDelete = await this.userService.getUserByOAuthIdAndPlatform(
          sub,
          OAuthPlatform.Apple,
        );
        if (!userToDelete) {
          throwIeumException('USER_NOT_FOUND');
        }
        await this.userService.deleteUser(userToDelete.id);
        console.log(`id: ${userToDelete.id} 유저가 회원탈퇴 하였습니다.`);
        break;
      default:
        throwIeumException('INVALID_APPLE_NOTIFICATION_TYPE');
    }

    return;
  }

  // ------------------------------------카카오 ----------------------------------------------------------

  async verifyKakaoAccessToken(accessToken: string): Promise<string> {
    try {
      const response: KakaoAccessTokenData = await axios.get(
        'https://kapi.kakao.com/v1/user/access_token_info',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return String(response.data.id);
    } catch (error) {
      throwIeumException('KAKAO_ACCESS_TOKEN_VERIFICATION_FAILED');
    }
  }

  //-----------------------------------네이버------------------------------------------------------------

  async verifyNaverAccessToken(accessToken: string): Promise<string> {
    try {
      const response: NaverAccessTokenData = await axios.get(
        'https://openapi.naver.com/v1/nid/me',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response.data.response.id;
    } catch (error) {
      throwIeumException('NAVER_ACCESS_TOKEN_VERIFICATION_FAILED');
    }
  }
}
