import { Module, Global } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtAccessNicknameCheckStrategy } from './strategies/jwt-access-nickname-check.strategy';
import { UserModule } from 'src/user/user.module';

@Global()
@Module({
  imports: [JwtModule.register({}), UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtAccessNicknameCheckStrategy,
  ],
  exports: [JwtAccessStrategy, JwtAccessNicknameCheckStrategy],
})
export class AuthModule {}
