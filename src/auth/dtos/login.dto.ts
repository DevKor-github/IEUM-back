import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OAuthPlatform } from 'src/common/enums/oAuth-platform.enum';

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  oAuthToken: string;

  @ApiProperty({ enum: OAuthPlatform })
  @IsEnum(OAuthPlatform)
  oAuthPlatform: OAuthPlatform;
}
