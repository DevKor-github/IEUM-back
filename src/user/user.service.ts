import { Injectable, NotFoundException } from '@nestjs/common';
import {
  FirstLoginReqDto,
  FirstLoginResDto,
  UserPreferenceDto,
} from './dtos/first-login.dto';
import { UserRepository } from 'src/repositories/user.repository';
import { PreferenceRepository } from 'src/repositories/preference.repository';
import { NotValidUserException } from 'src/common/exceptions/user.exception';
import { FolderRepository } from 'src/repositories/folder.repository';
import { FolderPlaceRepository } from 'src/repositories/folder-place.repository';
import { NickNameDuplicateCheckResDto } from './dtos/nickname-dupliate-check-res.dto';
import { ProfileResDto } from './dtos/profile-res.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly preferenceRepository: PreferenceRepository,
    private readonly folderRepository: FolderRepository,
    private readonly folderPlaceRepository: FolderPlaceRepository,
  ) {}

  //최초 유저 정보 기입
  async fillUserInfoAndPreference(
    firstLoginReqDto: FirstLoginReqDto,
    id: number,
  ): Promise<FirstLoginResDto> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotValidUserException('해당 유저가 존재하지 않아요.');
    }
    await this.userRepository.fillUserInfo(firstLoginReqDto, id);
    await this.preferenceRepository.fillUserPreference(
      new UserPreferenceDto(firstLoginReqDto),
      id,
    );
    const createdUser =
      await this.userRepository.getUserInfoAndPreferenceById(id);
    return new FirstLoginResDto(createdUser);
  }

  //회원탈퇴
  async deleteUser(id: number) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotValidUserException('해당 유저가 존재하지 않아요.');
    }
    await this.userRepository.softDeleteUser(id);
  }

  async getUserByUuid(uuid: string) {
    const user = await this.userRepository.findUserByUuid(uuid);
    if (!user) {
      throw new NotValidUserException('존재하지 않는 계정이에요.');
    }
    return user;
  }

  async getUserProfile(id: number): Promise<ProfileResDto> {
    const user = await this.userRepository.findUserById(id);

    if (!user) {
      throw new NotValidUserException('해당 유저가 존재하지 않아요.');
    }
    return new ProfileResDto(user);
  }

  async checkDuplicateNickName(
    nickname: string,
  ): Promise<NickNameDuplicateCheckResDto> {
    const user = await this.userRepository.findUserByNickname(nickname);
    if (user) {
      return new NickNameDuplicateCheckResDto(true);
    } else {
      return new NickNameDuplicateCheckResDto(false);
    }
  }
}
