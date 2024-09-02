import { Module, Global } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtAccessNicknameCheckStrategy } from './strategies/jwt-access-nickname-check.strategy';
import { UserModule } from 'src/user/user.module';
import { NicknameCheckingAccessGuard } from './guards/nickname-check-access.guard';

@Global()
@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
