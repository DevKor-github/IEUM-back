import {
  NotFoundInstaCollectionException,
  NotValidInstaGuestUserException,
} from './../common/exceptions/insta.exception';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FirstLoginDto } from './dtos/first-login.dto';
import { UserRepository } from 'src/repositories/user.repository';
import { PreferenceRepository } from 'src/repositories/preference.repository';
import { UserPreferenceDto } from './dtos/first-login.dto';
import { NotValidUserException } from 'src/common/exceptions/user.exception';
import { FolderRepository } from 'src/repositories/folder.repository';
import { FolderPlaceRepository } from 'src/repositories/folder-place.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly preferenceRepository: PreferenceRepository,
    private readonly folderRepository: FolderRepository,
    private readonly folderPlaceRepository: FolderPlaceRepository,
  ) {}

  //최초 유저 정보 기입
  async fillUserInfo(firstLoginDto: FirstLoginDto, id: number) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotValidUserException('해당 유저가 존재하지 않아요.');
    }
    await this.userRepository.fillUserInfo(firstLoginDto, id);
    await this.preferenceRepository.fillUserPreference(
      new UserPreferenceDto(firstLoginDto),
      id,
    );
    const createdUser = await this.userRepository.findUserById(id);
    return { message: `${createdUser.nickname}에 대한 최초 정보 기입 성공.` };
  }

  //회원탈퇴
  async deleteUser(id: number) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotValidUserException('해당 유저가 존재하지 않아요.');
    }
    await this.userRepository.softDeleteUser(id);
  }
}
