import { ApiProperty } from '@nestjs/swagger';

export class NickNameDuplicateCheckResDto {
  @ApiProperty()
  isDuplicate: boolean;

  constructor(isDuplicate: boolean) {
    this.isDuplicate = isDuplicate;
  }
}
