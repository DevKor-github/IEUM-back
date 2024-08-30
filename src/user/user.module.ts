import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PreferenceRepository } from 'src/user/repositories/preference.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import { JwtAccessStrategy } from 'src/auth/strategies/jwt-access.strategy';
import { JwtAccessNicknameCheckStrategy } from 'src/auth/strategies/jwt-access-nickname-check.strategy';

import { FolderRepository } from 'src/folder/repositories/folder.repository';
import { FolderPlaceRepository } from 'src/folder/repositories/folder-place.repository';
import { User } from './entities/user.entity';
import { Preference } from './entities/preference.entity';

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
  exports: [UserService],
})
export class UserModule {}
