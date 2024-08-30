import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { OAuthPlatform } from 'src/common/enums/oAuth-platform.enum';
import { User } from 'src/user/entities/user.entity';

export class UserLoginResDto {
  @ApiProperty()
  @IsString()
  uuid: string;

  @ApiProperty()
  @IsString()
  accessToken: string;

  @ApiProperty()
  @IsString()
  refreshToken: string;

  @ApiProperty()
  @IsEnum(OAuthPlatform)
  oAuthPlatform: OAuthPlatform;

  constructor(user: User, accessToken: string, refreshToken: string) {
    this.uuid = user.uuid;
    this.oAuthPlatform = user.oAuthPlatform;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

export class NewAccessTokenResDto extends PickType(UserLoginResDto, [
  'accessToken',
]) {
  constructor(newAccessToken: string) {
    super();
    this.accessToken = newAccessToken;
  }
}
