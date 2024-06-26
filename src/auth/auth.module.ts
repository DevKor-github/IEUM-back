import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from 'src/repositories/user.repository';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtAccessNicknameCheckStrategy } from './strategies/jwt-access-nickname-check.strategy';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    UserRepository,
    JwtAccessNicknameCheckStrategy,
  ],
  exports: [JwtAccessStrategy, JwtAccessNicknameCheckStrategy],
})
export class AuthModule {}
