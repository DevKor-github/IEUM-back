import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { OAuthPlatform } from 'src/common/enums/oAuth-platform.enum';

export class UserInfoDto {
  @IsString()
  uuid: string;

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  @IsEnum(OAuthPlatform)
  oAuthPlatform: OAuthPlatform;

  // @IsBoolean()
  // initialLogin: boolean;

  static fromCreation(
    uuid: string,
    oAuthPlatform: OAuthPlatform,
    accessToken: string,
    refreshToken: string,
  ): UserInfoDto {
    const dto = new UserInfoDto();
    dto.uuid = uuid;
    dto.oAuthPlatform = oAuthPlatform;
    dto.accessToken = accessToken;
    dto.refreshToken = refreshToken;
    return dto;
  }
}
