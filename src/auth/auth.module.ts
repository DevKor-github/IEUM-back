import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from 'src/user/repositories/user.repository';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtAccessNicknameCheckStrategy } from './strategies/jwt-access-nickname-check.strategy';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { PreferenceRepository } from 'src/user/repositories/preference.repository';
import { FolderRepository } from 'src/folder/repositories/folder.repository';
import { FolderPlaceRepository } from 'src/folder/repositories/folder-place.repository';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    UserRepository,
    JwtAccessNicknameCheckStrategy,
    UserService,
    PreferenceRepository,
    FolderRepository,
    FolderPlaceRepository,
  ],
  exports: [JwtAccessStrategy, JwtAccessNicknameCheckStrategy],
})
export class AuthModule {}
