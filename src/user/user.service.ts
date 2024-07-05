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
import { InstaGuestUserRepository } from 'src/repositories/insta-guest-user.repository';
import { FolderRepository } from 'src/repositories/folder.repository';
import { FolderPlaceRepository } from 'src/repositories/folder-place.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly instaGuestUserRepository: InstaGuestUserRepository,
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

  async connectInstagram(userId: number, instaId: string) {
    const instaGuestUser = await this.instaGuestUserRepository.findOne({
      where: { instaId: instaId },
    });
    if (!instaGuestUser) {
      throw new NotValidInstaGuestUserException(
        '해당 인스타그램 유저는 써머를 이용하고 있지 않아요.',
      );
    }
    const user = await this.userRepository.connectInstagram(
      userId,
      instaGuestUser,
    );
    return await this.syncInstagramFolder(user.id);
  }

  async syncInstagramFolder(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['instaGuestUser'],
    });
    if (!user) {
      throw new NotValidUserException('해당 유저가 존재하지 않아요.');
    }
    if (!user.instaGuestUser) {
      throw new NotValidInstaGuestUserException(
        '연결된 인스타그램 계정이 없어요.',
      );
    }
    const instaGuestUserId = user.instaGuestUser.id;

    const instaGuestPlaces: { place_id: number }[] =
      await this.instaGuestUserRepository.getInstaGuestPlaces(instaGuestUserId);

    const instaFolder = await this.folderRepository.getInstaFolder(userId);

    instaGuestPlaces.forEach((place) => {
      this.folderPlaceRepository.createFolderPlace(
        instaFolder.id,
        place.place_id,
      ); //어차피 syncInstagramFolder를 await로 호출할 것이므로 굳이 async-await를 사용하지 않아도 됨.
    });
    return await this.folderRepository.findOne({
      where: { id: instaFolder.id },
      relations: ['folderPlaces'],
    });
  }
}
