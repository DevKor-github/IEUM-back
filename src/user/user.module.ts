import { Module } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Preference } from 'src/entities/preference.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PreferenceRepository } from 'src/repositories/preference.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { JwtAccessStrategy } from 'src/auth/strategies/jwt-access.strategy';
import { JwtAccessNicknameCheckStrategy } from 'src/auth/strategies/jwt-access-nickname-check.strategy';

import { FolderRepository } from 'src/repositories/folder.repository';
import { FolderPlaceRepository } from 'src/repositories/folder-place.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Preference])],
  controllers: [UserController],
  providers: [
    UserService,
    PreferenceRepository,
    UserRepository,
    FolderRepository,
    FolderPlaceRepository,
    JwtAccessStrategy,
    JwtAccessNicknameCheckStrategy,
  ],
})
export class UserModule {}
