import { ApiProperty } from '@nestjs/swagger';
import { Place } from 'src/entities/place.entity';

export class PlacePreviewResDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  hashTags: string[] = [];

  @ApiProperty()
  url: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  constructor(place: Place) {
    this.id = place.id;
    this.name = place.name;
    this.category = place.primaryCategory;
    const depth2Address = place.address.split(' ');
    this.address = depth2Address.slice(0, 2).join(' ');
    this.url = place.placeImages.length != 0 ? place.placeImages[0].url : null;
    this.hashTags = place.placeTags
      .filter(
        (placeTag) =>
          placeTag.tag.type == 1 ||
          placeTag.tag.type == 2 ||
          placeTag.tag.type == 3,
      )
      .map((placeTag) => placeTag.tag.tagName);
    this.latitude = place.latitude;
    this.longitude = place.longitude;
  }
}
