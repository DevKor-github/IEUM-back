import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { OAuthPlatform } from 'src/common/enums/oAuth-platform.enum';
import { User } from 'src/entities/user.entity';

export class UserLoginResDto {
  @IsString()
  uuid: string;

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  @IsEnum(OAuthPlatform)
  oAuthPlatform: OAuthPlatform;

  constructor(user: User, accessToken: string, refreshToken: string) {
    this.uuid = user.uuid;
    this.oAuthPlatform = user.oAuthPlatform;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
