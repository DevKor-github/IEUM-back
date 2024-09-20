import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { IeumCategory } from 'src/common/enums/ieum-category.enum';

export class KakaoCategoryMappingReqDto {
  @ApiProperty({
    description: '이음 카테고리(IeumCategory)',
    examples: ['FOOD'],
  })
  @IsEnum(IeumCategory)
  ieumCategory: IeumCategory;

  @ApiProperty({
    description: '카카오 카테고리(primaryCategory)',
    example: '일식',
  })
  kakaoCategory: string;
}
