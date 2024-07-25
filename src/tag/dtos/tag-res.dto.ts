import { ApiProperty } from '@nestjs/swagger';
import { TagType } from 'src/common/enums/tag-type.enum';
import { Tag } from 'src/entities/tag.entity';

export class TagResDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  tagName: string;

  @ApiProperty()
  type: TagType;

  constructor(tag: Tag) {
    this.id = tag.id;
    this.tagName = tag.tagName;
    this.type = tag.type;
  }
}
