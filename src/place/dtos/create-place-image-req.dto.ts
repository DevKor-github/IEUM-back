import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePlaceImageReqDto {
  @ApiProperty()
  @IsString()
  placeId: number;

  //유효성 검사의 목적 및 swagger에 request data 형식 표시 목적
  @ApiProperty({ type: 'string', format: 'binary' }) // 파일을 나타내는 ApiProperty
  placeImage: Express.Multer.File; // Express.Multer.File 타입의 file 필드
}
