import { MethodNames } from 'src/common/types/method-names.type';
import { AuthController } from './auth.controller';
import { RefreshGuard } from './guards/refresh.guard';
import { UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
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
    UseGuards(RefreshGuard),
    ApiBearerAuth('Refresh Token'),
    ApiOkResponse({
      type: NewAccessTokenResDto,
      description: '새 토큰 발급 성공',
    }),
    ApiIeumExceptionRes(['NOT_VALID_REFRESH', 'LOGIN_REQUIRED']),
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
    ApiIeumExceptionRes(['DEFAULT_BAD_REQUEST']),
  ],
  handleAppleNotification: [
    ApiOperation({
      summary: '애플 유저 관련 공지 endpoint',
      description:
        '애플에서 유저가 "이메일 수신 중단/활성화, 앱 서비스 해지, 애플 계정 탈퇴"를 했을 경우',
    }),
  ],
};
