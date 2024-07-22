import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { FirstLoginDto } from 'src/user/dtos/first-login.dto';
import { OAuthPlatform } from 'src/common/enums/oAuth-platform.enum';
import { InstaGuestUser } from 'src/entities/insta-guest-user.entity';
import { NotValidUserException } from 'src/common/exceptions/user.exception';
import { MarkerResDto } from 'src/place/dtos/marker-res.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { PlaceListReqDto } from 'src/place/dtos/place-list-pagination-req.dto';
import { PlaceListDataDto } from 'src/place/dtos/place-list-pagination-res.dto';
import { FolderType } from 'src/common/enums/folder-type.enum';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findUserById(id: number): Promise<User> {
    const user = this.findOne({ where: { id: id } });
    return user;
  }

  async softDeleteUser(id: number) {
    // const user = await this.findUserById(id);
    // user.deletedAt = new Date();
    // await this.save(user);
    await this.softDelete({ id: id });
  }

  async renewRefreshToken(oAuthId: string, refreshToken: string) {
    const user = await this.findUserByAppleOAuthId(oAuthId);
    user.refreshToken = refreshToken;
    return await this.save(user);
  }

  async fillUserInfo(firstLoginDto: FirstLoginDto, id: number) {
    const user = await this.findUserById(id);

    user.nickname = firstLoginDto.nickname;
    user.birthDate = new Date(firstLoginDto.birthDate);
    user.sex = firstLoginDto.sex;
    user.mbti = firstLoginDto.mbti;

    return await this.save(user);
  }

  async connectInstagram(userId: number, instaGuestUser: InstaGuestUser) {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotValidUserException('존재하지 않는 유저에요.');
    }
    user.instaGuestUser = instaGuestUser;
    return await this.save(user);
  }

  async getMarkers(
    userId: number,
    addressCollection: string[],
    categoryCollection: string[],
    folderId?: number,
  ): Promise<MarkerResDto[]> {
    const markerCollection = this.createQueryBuilder('user')
      .innerJoinAndSelect('user.folders', 'folder')
      .innerJoinAndSelect('folder.folderPlaces', 'folderPlace')
      .innerJoinAndSelect('folderPlace.place', 'place')
      .select([
        'place.id',
        'place.name',
        'place.latitude',
        'place.longitude',
        'place.primary_category',
      ])
      .where('user.id = :userId', { userId });

    //folder별로 보여줘야 한다면
    if (folderId !== undefined) {
      markerCollection.andWhere('folder.id = :folderId', { folderId });
    } else {
      markerCollection.andWhere('folder.type = :folderType', {
        folderType: FolderType.Default,
      });
    }
    //address로 필터링 되어야 한다면
    //place.address LIKE a% OR b%는 지원하지 않아 place.address LIKE a% OR place.address LIKE b%와 같이 작성하여야 함.
    if (addressCollection && addressCollection.length != 0) {
      const addressConditions = addressCollection.map(
        (address, index) => `place.address LIKE :address${index}`,
      );
      markerCollection.andWhere(
        `(${addressConditions.join(' OR ')})`,
        addressCollection.reduce((params, address, index) => {
          params[`address${index}`] = `${address}%`;
          return params;
        }, {}),
      );
    }

    //category로 필터링 되어야 한다면
    if (categoryCollection && categoryCollection.length != 0) {
      markerCollection
        .andWhere('place.primary_category IN (:...categories)')
        .setParameter('categories', categoryCollection);
    }

    const result = await markerCollection
      .orderBy('place.id', 'DESC')
      .getRawMany();

    //plainToInstance함수는 javascript 객체를 특정 class의 instance로 변환시켜준다.
    return plainToInstance(MarkerResDto, result);
  }

  async getPlaceList(
    userId: number,
    placeListReqDto: PlaceListReqDto,
  ): Promise<PlaceListDataDto[]> {
    const placeCollection = this.createQueryBuilder('user')
      .innerJoinAndSelect('user.folders', 'folder')
      .innerJoinAndSelect('folder.folderPlaces', 'folderPlace')
      .innerJoinAndSelect('folderPlace.place', 'place')
      .select([
        'place.id AS id',
        'place.name AS name',
        'place.address AS address',
        'place.primary_category AS category ',
      ])
      .where('user.id = :userId', { userId })
      .andWhere('folder.type = :folderType', {
        folderType: FolderType.Default,
      }); //default에 있는 장소들 가져옴.

    //첫 호출이라 cursor 값이 0이라면
    if (!placeListReqDto.cursorId) {
      if (
        placeListReqDto.addressCollection &&
        placeListReqDto.addressCollection.length != 0
      ) {
        const addressConditions = placeListReqDto.addressCollection.map(
          (address, index) => `place.address LIKE :address${index}`,
        );
        placeCollection.andWhere(
          `(${addressConditions.join(' OR ')})`,
          placeListReqDto.addressCollection.reduce((params, address, index) => {
            params[`address${index}`] = `${address}%`;
            return params;
          }, {}),
        );
      }
      if (
        placeListReqDto.categoryCollection &&
        placeListReqDto.categoryCollection.length != 0
      ) {
        placeCollection
          .andWhere('place.primary_category IN (:...categories)')
          .setParameter('categories', placeListReqDto.categoryCollection);
      }
      placeCollection
        .orderBy('place.id', 'DESC')
        .limit(placeListReqDto.take * 2 + 1);
    }

    //두 번째 호출부터라 cursor값이 있다면
    else {
      placeCollection.andWhere('place.id < :cursorId', {
        cursorId: placeListReqDto.cursorId,
      });

      if (
        placeListReqDto.addressCollection &&
        placeListReqDto.addressCollection.length != 0
      ) {
        const addressConditions = placeListReqDto.addressCollection.map(
          (address, index) => `place.address LIKE :address${index}`,
        );
        placeCollection.andWhere(
          `(${addressConditions.join(' OR ')})`,
          placeListReqDto.addressCollection.reduce((params, address, index) => {
            params[`address${index}`] = `${address}%`;
            return params;
          }, {}),
        );
      }
      if (
        placeListReqDto.categoryCollection &&
        placeListReqDto.categoryCollection.length != 0
      ) {
        placeCollection
          .andWhere('place.primary_category IN (:...categories)')
          .setParameter('categories', placeListReqDto.categoryCollection);
      }
      placeCollection
        .orderBy('place.id', 'DESC')
        .limit(placeListReqDto.take + 1);
    }

    const result = await placeCollection.getRawMany();
    //place_image join 추가해서 image url 반환 해야함.

    return result;
  }

  // ----------------------------애플 --------------------------------

  async findUserByAppleOAuthId(authId: string): Promise<User> {
    const user = this.findOne({ where: { oAuthId: authId } });
    return user;
  }

  async appleSignIn(oAuthId: string): Promise<User> {
    //로그인 후 앱 자체 회원가입 직후 flow 통한 나머지 field 채워야 함.
    const user = this.create({
      oAuthId: oAuthId,
      oAuthPlatform: OAuthPlatform.Apple,
    });
    return await this.save(user);
  }
}
