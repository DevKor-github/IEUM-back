import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { FirstLoginDto } from 'src/user/dtos/first-login.dto';
import { OAuthPlatform } from 'src/common/enums/oAuth-platform.enum';
import { InstaGuestUser } from 'src/entities/insta-guest-user.entity';
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

  async softDeleteUser(id: number) {
    // const user = await this.findUserById(id);
    // user.deletedAt = new Date();
    // await this.save(user);
    await this.softDelete({ id: id });
  }

  async renewRefreshToken(oAuthId: string, jti: string) {
    const user = await this.findUserByAppleOAuthId(oAuthId);
    user.jti = jti;
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
