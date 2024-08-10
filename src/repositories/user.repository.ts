import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { FirstLoginReqDto } from 'src/user/dtos/first-login.dto';
import { OAuthPlatform } from 'src/common/enums/oAuth-platform.enum';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findUserById(id: number): Promise<User> {
    const user = this.findOne({ where: { id: id } });
    return user;
  }

  async getUserInfoAndPreferenceById(id: number): Promise<User> {
    const user = this.findOne({ where: { id: id }, relations: ['preference'] });
    return user;
  }

  async findUserByUuid(uuid: string) {
    return await this.findOne({ where: { uuid: uuid } });
  }

  async softDeleteUser(id: number) {
    // const user = await this.findUserById(id);
    // user.deletedAt = new Date();
    // await this.save(user);
    await this.softDelete({ id: id });
  }

  async renewRefreshToken(id: number, jti: string) {
    const user = await this.findUserById(id);
    user.jti = jti;
    return await this.save(user);
  }

  async fillUserInfo(firstLoginReqDto: FirstLoginReqDto, id: number) {
    const user = await this.findUserById(id);

    user.nickname = firstLoginReqDto.nickname;
    user.birthDate = new Date(firstLoginReqDto.birthDate);
    user.sex = firstLoginReqDto.sex;
    user.mbti = firstLoginReqDto.mbti;

    return await this.save(user);
  }

  // ----------------------------소셜 --------------------------------

  async findUserByOAuthIdAndPlatform(
    oAuthId: string,
    oAuthPlatform: OAuthPlatform,
  ): Promise<User> {
    const user = this.findOne({
      where: { oAuthId: oAuthId, oAuthPlatform: oAuthPlatform },
    });
    return user;
  }

  async socialSignIn(
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
