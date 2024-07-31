import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderReqDto {
  @ApiProperty()
  name: string;
}
