import { ApiProperty } from '@nestjs/swagger';
import { OAuthPlatform } from 'src/common/enums/oAuth-platform.enum';
import { User } from '../entities/user.entity';

export class ProfileResDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty({ example: OAuthPlatform.Apple })
  oAuthPlatform: OAuthPlatform;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  birthDate: Date;

  @ApiProperty({ example: 'm' })
  sex: string;

  @ApiProperty({ example: 'ISTJ' })
  mbti: string;

  @ApiProperty()
  isAdConfirmed: boolean;

  constructor(user: User) {
    this.uuid = user.uuid;
    this.oAuthPlatform = user.oAuthPlatform;
    this.nickname = user.nickname;
    this.birthDate = user.birthDate;
    this.sex = user.sex;
    this.mbti = user.mbti;
    this.isAdConfirmed = user.isAdConfirmed;
  }
}
