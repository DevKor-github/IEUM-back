import { Module, Global } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { NicknameCheckingAccessGuard } from './guards/nickname-check-access.guard';
import { SlackAlertService } from 'src/crawling/services/slack-alert.service';

@Global()
@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, SlackAlertService],
  exports: [JwtModule],
})
export class AuthModule {}
