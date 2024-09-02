import { Injectable } from '@nestjs/common';
import {
  FirstLoginReqDto,
  FirstLoginResDto,
  UserPreferenceDto,
} from './dtos/first-login.dto';
import { UserRepository } from 'src/user/repositories/user.repository';
import { PreferenceRepository } from 'src/user/repositories/preference.repository';
import { NotValidUserException } from 'src/common/exceptions/user.exception';
import { NickNameDuplicateCheckResDto } from './dtos/nickname-dupliate-check-res.dto';
import { ProfileResDto } from './dtos/profile-res.dto';
import { OAuthPlatform } from 'src/common/enums/oAuth-platform.enum';
import { throwIeumException } from 'src/common/utils/exception.util';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly preferenceRepository: PreferenceRepository,
  ) {}
  //유저 검색
  async getUserById(id: number) {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throwIeumException('NOT_VALID_USER');
    }
    return user;
  }

  async getUserByUuid(uuid: string) {
    const user = await this.userRepository.getUserByUuid(uuid);
    if (!user) {
      throwIeumException('NOT_VALID_USER');
    }
    return user;
  }

  async getUserByOAuthIdAndPlatform(
    oAuthId: string,
    oAuthPlatform: OAuthPlatform,
  ) {
    return await this.userRepository.getUserByOAuthIdAndPlatform(
      oAuthId,
      oAuthPlatform,
    );
  }

  async checkDuplicateNickName(
    nickname: string,
  ): Promise<NickNameDuplicateCheckResDto> {
    const user = await this.userRepository.getUserByNickname(nickname);
    return new NickNameDuplicateCheckResDto(user ? true : false);
  }

  //유저 정보
  async getUserProfile(id: number): Promise<ProfileResDto> {
    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throwIeumException('NOT_VALID_USER');
    }
    return new ProfileResDto(user);
  }

  async fillUserInfoAndPreference(
    firstLoginReqDto: FirstLoginReqDto,
    id: number,
  ): Promise<FirstLoginResDto> {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throwIeumException('NOT_VALID_USER');
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
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throwIeumException('NOT_VALID_USER');
    }
    await this.userRepository.softDeleteUser(id);
  }

  //토큰 정보
  async getUserFCMToken(id: number): Promise<string> {
    return await this.userRepository.getFCMToken(id);
  }

  async updateFCMToken(id: number, fcmToken: string) {
    return await this.userRepository.updateFCMToken(id, fcmToken);
  }

  async renewRefreshToken(id: number, jti: string) {
    return await this.userRepository.renewRefreshToken(id, jti);
  }

  //로그인

  async socialLogin(oAuthId: string, oAuthPlatform: OAuthPlatform) {
    return await this.userRepository.socialLogin(oAuthId, oAuthPlatform);
  }
}
