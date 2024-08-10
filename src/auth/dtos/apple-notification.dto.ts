import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AppleNotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  payload: string;
}
