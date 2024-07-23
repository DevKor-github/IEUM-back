import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { FirstLoginDto } from 'src/user/dtos/first-login.dto';
import { OAuthPlatform } from 'src/common/enums/oAuth-platform.enum';
import { NotValidUserException } from 'src/common/exceptions/user.exception';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findUserById(id: number): Promise<User> {
    const user = this.findOne({ where: { id: id } });
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
