import { MethodNames } from 'src/common/types/method-names.type';
import { AuthController } from './auth.controller';
import { UseRefreshGuard } from './guards/refresh.guard';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  NewAccessTokenResDto,
  UserLoginResDto,
} from './dtos/user-login-res.dto';
import { ApiIeumExceptionRes } from 'src/common/decorators/api-ieum-exception-res.decorator';

type AuthMethodName = MethodNames<AuthController>;

export const AuthDocs: Record<AuthMethodName, MethodDecorator[]> = {
  renewAccessToken: [
    UseRefreshGuard(),
    ApiIeumExceptionRes(['REFRESH_TOKEN_NOT_MATCHED']),
    ApiOkResponse({
      type: NewAccessTokenResDto,
      description: '새 토큰 발급 성공',
    }),
    ApiOperation({ description: 'AccessToken 재발급' }),
  ],
  socialLogin: [
    ApiOperation({
      summary: '소셜 로그인',
    }),
    ApiCreatedResponse({
      description: '소셜 로그인 성공',
      type: UserLoginResDto,
    }),
    ApiIeumExceptionRes([
      'UNSUPPORTED_OAUTH_PLATFORM',
      'APPLE_PUBLIC_KEY_NOT_FOUND',
      'APPLE_ID_TOKEN_VERIFICATION_FAILED',
      'KAKAO_ACCESS_TOKEN_VERIFICATION_FAILED',
      'NAVER_ACCESS_TOKEN_VERIFICATION_FAILED',
    ]),
  ],
  handleAppleNotification: [
    ApiOperation({
      summary: '애플 유저 관련 공지 endpoint',
      description:
        '애플에서 유저가 "이메일 수신 중단/활성화, 앱 서비스 해지, 애플 계정 탈퇴"를 했을 경우',
    }),
    ApiIeumExceptionRes([
      'USER_NOT_FOUND',
      'APPLE_PUBLIC_KEY_NOT_FOUND',
      'APPLE_ID_TOKEN_VERIFICATION_FAILED',
      'INVALID_APPLE_NOTIFICATION_TYPE',
    ]),
  ],
};
