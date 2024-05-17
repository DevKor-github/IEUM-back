import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessStrategy } from './strategies/jwt-access-strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh-strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from 'src/repositories/user.repository';
import { PreferenceRepository } from 'src/repositories/preference.repository';
import { Preference } from 'src/entities/preference.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Preference]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    UserRepository,
    PreferenceRepository,
  ],
})
export class AuthModule {}
