import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { TagType } from 'src/common/enums/tag-type.enum';

export class CreateTagReqDto {
  @ApiProperty()
  @IsString()
  tagName: string;

  @ApiProperty()
  tagType: TagType;
}
