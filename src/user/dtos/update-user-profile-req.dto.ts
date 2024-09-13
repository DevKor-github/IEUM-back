import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsArray,
  IsInt,
  Min,
  Max,
  IsDateString,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
  IsIn,
} from 'class-validator';
import {
  MBTI,
  preferredCompanion,
  preferredRegion,
} from 'src/common/enums/preference.enum';

export class UpdateUserProfileReqDto {
  @ApiProperty({ description: '광고 동의 여부', nullable: true })
  @IsBoolean()
  @IsOptional()
  isAdConfirmed?: boolean;

  @ApiProperty({ description: '닉네임', example: '닉네임' })
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @ApiProperty({ description: '생년월일', example: '1999-07-08' })
  @IsNotEmpty()
  @IsDateString() // 0000-00-00형식인지 검증
  birthDate: string;

  @ApiProperty({ description: '성별. M or F', example: 'M' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(1)
  @IsIn(['M', 'F'])
  sex: string;

  @ApiProperty({ description: 'MBTI', example: 'ISTJ' })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  @IsEnum(MBTI)
  mbti: MBTI;

  @ApiProperty({
    enum: preferredRegion,
    description:
      '선호 지역들을 전달. 하나로 묶여있는 지역이라도 각각 따로 보내주세요. 예시에 적힌 지역들만 전달 가능합니다. 여기에 해당하지 않으면 400 에러',
    example: ['대전', '세종', '충북', '충남'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsEnum(preferredRegion, { each: true })
  preferredRegions: preferredRegion[];

  @ApiProperty({
    enum: preferredCompanion,
    description: '선호 동반자를 대문자 String으로 전달.',
    example: ['나홀로', '친구'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsEnum(preferredCompanion, { each: true })
  preferredCompanions: preferredCompanion[];

  @ApiProperty({
    example: 1,
    description: '저렴한 여행지 ~ 비싼 여행지. 1~5로 입력',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  cheapOrExpensive: number;

  @ApiProperty({
    example: 1,
    description: '계획적인 여행 ~ 즉흥적인 여행. 1~5로 입력',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  plannedOrImprovise: number;

  @ApiProperty({
    example: 1,
    description: '알차게 여행 ~ 여유롭게 여행. 1~5로 입력',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  tightOrLoose: number;

  @ApiProperty({
    example: 1,
    description: '인기있는 여행지 ~ 로컬 여행지. 1~5로 입력',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  popularOrLocal: number;

  @ApiProperty({
    example: 1,
    description: '자연적인 여행지 ~ 도시적인 여행지. 1~5로 입력',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  natureOrCity: number;

  @ApiProperty({
    example: 1,
    description: '휴양 여행 ~ 액티비티 여행. 1~5로 입력',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  restOrActivity: number;
}
