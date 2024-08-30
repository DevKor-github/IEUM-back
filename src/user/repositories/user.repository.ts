import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FirstLoginReqDto } from 'src/user/dtos/first-login.dto';
import { OAuthPlatform } from 'src/common/enums/oAuth-platform.enum';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  //유저 검색
  async getUserById(id: number): Promise<User> {
    const user = this.findOne({ where: { id: id } });
    return user;
  }

  async getUserByUuid(uuid: string) {
    return await this.findOne({ where: { uuid: uuid } });
  }

  async getUserByNickname(nickname: string): Promise<User> {
    const user = this.findOne({ where: { nickname: nickname } });
    return user;
  }

  async getUserByOAuthIdAndPlatform(
    oAuthId: string,
    oAuthPlatform: OAuthPlatform,
  ): Promise<User> {
    const user = this.findOne({
      where: { oAuthId: oAuthId, oAuthPlatform: oAuthPlatform },
    });
    return user;
  }

  //유저 정보
  async getUserInfoAndPreferenceById(id: number): Promise<User> {
    const user = this.findOne({ where: { id: id }, relations: ['preference'] });
    return user;
  }

  async fillUserInfo(firstLoginReqDto: FirstLoginReqDto, id: number) {
    const user = await this.getUserById(id);

    user.isAdConfirmed = firstLoginReqDto.isAdConfirmed
      ? firstLoginReqDto.isAdConfirmed
      : false;
    user.nickname = firstLoginReqDto.nickname;
    user.birthDate = new Date(firstLoginReqDto.birthDate);
    user.sex = firstLoginReqDto.sex;
    user.mbti = firstLoginReqDto.mbti;

    return await this.save(user);
  }

  // Token
  async getFCMToken(id: number): Promise<string> {
    const user = await this.findOne({
      where: { id: id },
    });
    return user.fcmToken;
  }

  async updateFCMToken(id: number, fcmToken: string) {
    const user = await this.getUserById(id);
    user.fcmToken = fcmToken;
    return await this.save(user);
  }

  async renewRefreshToken(id: number, jti: string) {
    const user = await this.getUserById(id);
    user.jti = jti;
    return await this.save(user);
  }

  //회원 탈퇴

  async softDeleteUser(id: number) {
    await this.softDelete({ id: id });
  }

  // ----------------------------소셜 --------------------------------

  async socialLogin(
    oAuthId: string,
    oAuthPlatform: OAuthPlatform,
  ): Promise<User> {
    //로그인 후 앱 자체 회원가입 직후 flow 통한 나머지 field 채워야 함.
    const user = this.create({
      oAuthId: oAuthId,
      oAuthPlatform: oAuthPlatform,
    });
    return await this.save(user);
  }
}
