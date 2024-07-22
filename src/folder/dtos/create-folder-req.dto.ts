import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateFolderReqDto {
  @ApiProperty()
  @Type(() => String)
  name: string;
}
