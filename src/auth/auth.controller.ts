import { Controller, Get, Req, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import {
  NewAccessTokenResDto,
  UserLoginResDto,
} from './dtos/user-login-res.dto';
import { AppleNotificationDto } from './dtos/apple-notification.dto';
import { ApplyDocs } from 'src/common/decorators/apply-docs.decorator';
import { AuthDocs } from './auth.docs';
import { UseRefreshGuard } from './guards/refresh.guard';

@ApplyDocs(AuthDocs)
@Controller('auth')
@ApiTags('인증/인가 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseRefreshGuard()
  @Get('/refresh')
  renewAccessToken(@Req() req): Promise<NewAccessTokenResDto> {
    return this.authService.renewAccessToken(
      //passport 인증은 jwt에서 추출한 정보를 user 속성에 담는다!!!
      req.user.id,
      req.user.jti,
    );
  }

  // -------------------------- 소셜 로그인 --------------------------------

  @Post('/login/social')
  async socialLogin(@Body() loginDto: LoginDto): Promise<UserLoginResDto> {
    return this.authService.socialLoginTokenVerification(
      loginDto.oAuthToken,
      loginDto.oAuthPlatform,
      // loginDto.fcmToken,
    );
  }
  //애플에서 유저가 "이메일 변경, 앱 서비스 해지, 애플 계정 탈퇴"를 했을 경우,
  //App ID apple sign in 에서 입력한 Endpoint URL로 유저 정보와 이벤트에 대한 PAYLOAD 데이터를 전송.
  @Post('/social/apple-endpoint')
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
