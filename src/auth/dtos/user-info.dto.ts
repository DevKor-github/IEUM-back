import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class UserInfoDto {
  @IsString()
  uuid: string;

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  @IsBoolean()
  initialLogin: boolean;

  static fromCreation(
    uuid: string,
    accessToken: string,
    refreshToken: string,
  ): UserInfoDto {
    const dto = new UserInfoDto();
    dto.uuid = uuid;
    dto.accessToken = accessToken;
    dto.refreshToken = refreshToken;
    return dto;
  }
}
