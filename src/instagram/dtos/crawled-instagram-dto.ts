import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CrawledInstagramDto {
  @ApiProperty()
  @IsNotEmpty()
  googlePlaceId: string;

  @ApiProperty()
  @IsOptional()
  instagramDescription: string;

  @ApiProperty()
  @IsNotEmpty()
  instagramId: string;

  @ApiProperty()
  @IsNotEmpty()
  instagramLink: string;

  @ApiProperty()
  @IsNotEmpty()
  embeddedTag: string;
}

export class CrawledInstagramByKeywordDto {
  @ApiProperty()
  @IsNotEmpty()
  keyword: string;

  @ApiProperty()
  @IsOptional()
  instagramDescription: string;

  @ApiProperty()
  @IsNotEmpty()
  instagramId: string;

  @ApiProperty()
  @IsNotEmpty()
  instagramLink: string;

  @ApiProperty()
  @IsNotEmpty()
  embeddedTag: string;
}
