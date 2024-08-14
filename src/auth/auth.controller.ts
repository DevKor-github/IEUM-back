import {
  Controller,
  Get,
  Delete,
  UseGuards,
  Req,
  Put,
  Body,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import {
  NewAccessTokenResDto,
  UserLoginResDto,
} from './dtos/user-login-res.dto';
import { AppleNotificationDto } from './dtos/apple-notification.dto';
import { CustomAuthSwaggerDecorator } from 'src/common/decorators/auth-swagger.decorator';
import { CustomErrorResSwaggerDecorator } from 'src/common/decorators/error-res-swagger-decorator';
import { ErrorCodeEnum } from 'src/common/enums/error-code.enum';

@Controller('auth')
@ApiTags('인증/인가 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('refresh'))
  @Get('/refresh')
  @ApiBearerAuth('Refresh Token')
  @ApiResponse({
    status: 200,
    description: 'Access Token 재발급 성공',
    type: NewAccessTokenResDto,
  })
  @ApiOperation({
    summary: 'Access Token 재발급',
  })
  @CustomErrorResSwaggerDecorator([
    {
      statusCode: ErrorCodeEnum.NotValidRefresh,
      message: '유효한 refresh 토큰이 아님.',
    },
    {
      statusCode: ErrorCodeEnum.DefaultUnauthorized,
      message: '인증 실패로 인한 권한 없음.',
    },
  ])
  //header 값 가져오는 데코레이터
  //header에 authorization 필드가 인증 정보를 가지고 있음.
  // req.headers.authorization.substring(7),
  renewAccessToken(@Req() req): Promise<NewAccessTokenResDto> {
    return this.authService.newAccessToken(
      //passport 인증은 jwt에서 추출한 정보를 user 속성에 담는다!!!
      req.user.id,
      req.user.jti,
    );
  }

  // -------------------------- 소셜 로그인 --------------------------------
  @ApiOperation({
    summary: 'social sign in / login',
  })
  @ApiResponse({
    status: 201,
    description: '소셜 로그인 성공',
    type: UserLoginResDto,
  })
  @CustomErrorResSwaggerDecorator([
    {
      statusCode: ErrorCodeEnum.DefaultBadRequest,
      message: '입력받은 토큰에 문제가 있어 검증이 불가하거나 검증에 실패함.',
    },
  ])
  @Post('/login/social')
  async socialLogin(@Body() loginDto: LoginDto): Promise<UserLoginResDto> {
    return this.authService.socialLoginTokenVerification(
      loginDto.oAuthToken,
      loginDto.oAuthPlatform,
    );
  }
  //애플에서 유저가 "이메일 변경, 앱 서비스 해지, 애플 계정 탈퇴"를 했을 경우,
  //App ID apple sign in 에서 입력한 Endpoint URL로 유저 정보와 이벤트에 대한 PAYLOAD 데이터를 전송.
  @Post('/social/apple-endpoint')
  @ApiOperation({
    summary: '애플 유저 관련 공지 endpoint',
    description:
      '애플에서 유저가 "이메일 수신 중단/활성화, 앱 서비스 해지, 애플 계정 탈퇴"를 했을 경우',
  })
  async handleAppleNotification(
    @Body() appleNotificationDto: AppleNotificationDto,
  ) {
    //논의 필요.
    return this.authService.handleAppleNotification(
      appleNotificationDto.payload,
    );
  }
  //카카오, 네이버 회원 정보 수정됐을 시 받는 endpoint
}
