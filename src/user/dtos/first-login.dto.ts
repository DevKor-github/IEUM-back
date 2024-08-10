import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsDate,
  IsArray,
  IsInt,
  Min,
  Max,
  IsDateString,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { OAuthPlatform } from 'src/common/enums/oAuth-platform.enum';
import { User } from 'src/entities/user.entity';

export class FirstLoginReqDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @ApiProperty({ description: '0000-00-00 format', example: '1999-07-08' })
  @IsNotEmpty()
  @IsDateString() // 0000-00-00형식인지 검증
  birthDate: string;

  @ApiProperty({ example: 'M' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(1)
  sex: string;

  @ApiProperty({ example: 'ISTJ' })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  mbti: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  preferredRegion: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  preferredCompanion: string[];

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  @Max(5)
  budgetStyle: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  @Max(5)
  planningStyle: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  @Max(5)
  scheduleStyle: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  @Max(5)
  destinationStyle1: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  @Max(5)
  destinationStyle2: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  @Max(5)
  destinationStyle3: number;
}

export class UserPreferenceDto extends PickType(FirstLoginReqDto, [
  'preferredRegion',
  'preferredCompanion',
  'budgetStyle',
  'planningStyle',
  'scheduleStyle',
  'destinationStyle1',
  'destinationStyle2',
  'destinationStyle3',
]) {
  constructor(firstLoginReqDto: FirstLoginReqDto) {
    super(FirstLoginReqDto);
    this.preferredRegion = firstLoginReqDto.preferredRegion;
    this.preferredCompanion = firstLoginReqDto.preferredCompanion;
    this.budgetStyle = firstLoginReqDto.budgetStyle;
    this.planningStyle = firstLoginReqDto.planningStyle;
    this.scheduleStyle = firstLoginReqDto.scheduleStyle;
    this.destinationStyle1 = firstLoginReqDto.destinationStyle1;
    this.destinationStyle2 = firstLoginReqDto.destinationStyle2;
    this.destinationStyle3 = firstLoginReqDto.destinationStyle3;
  }
}

export class FirstLoginResDto extends PickType(FirstLoginReqDto, [
  'nickname',
  'birthDate',
  'sex',
  'mbti',
  'preferredRegion',
  'preferredCompanion',
  'budgetStyle',
  'planningStyle',
  'scheduleStyle',
  'destinationStyle1',
  'destinationStyle2',
  'destinationStyle3',
]) {
  @ApiProperty()
  @IsString()
  uuid: string;

  @ApiProperty()
  @IsString()
  oAuthId: string;

  @ApiProperty()
  @IsEnum(OAuthPlatform)
  oAuthPlatform: OAuthPlatform;

  constructor(user: User) {
    super(FirstLoginReqDto);
    this.uuid = user.uuid;
    this.oAuthId = user.oAuthId;
    this.oAuthPlatform = user.oAuthPlatform;
    this.nickname = user.nickname;
    this.birthDate = String(user.birthDate);
    this.sex = user.sex;
    this.mbti = user.mbti;
    this.preferredRegion = user.preference.preferredRegion;
    this.preferredCompanion = user.preference.preferredCompanion;
    this.budgetStyle = user.preference.budgetStyle;
    this.planningStyle = user.preference.planningStyle;
    this.scheduleStyle = user.preference.scheduleStyle;
    this.destinationStyle1 = user.preference.destinationStyle1;
    this.destinationStyle2 = user.preference.destinationStyle2;
    this.destinationStyle3 = user.preference.destinationStyle3;
  }
}
