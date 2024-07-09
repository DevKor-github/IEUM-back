import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateInstaGuestCollectionDto {
  @IsNotEmpty()
  link: string;

  @IsNotEmpty()
  embeddedTag: string;

  @IsOptional()
  content: string;
}
