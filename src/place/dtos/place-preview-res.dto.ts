import { ApiProperty } from '@nestjs/swagger';
import { RawPlacePreview } from 'src/common/interfaces/raw-place-preview.interface';

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
  tags: string[];

  @ApiProperty()
  url: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  constructor(placeInfo: RawPlacePreview) {
    this.id = placeInfo.place_id;
    this.name = placeInfo.place_name;
    this.category = placeInfo.place_primary_category;
    const depth2Address = placeInfo.place_address.split(' ');
    this.address = depth2Address.slice(0, 2).join(' ');
    this.url = placeInfo.place_imageURL;
    this.tags = placeInfo.place_tag_name;
    this.latitude = placeInfo.place_latitude;
    this.longitude = placeInfo.place_longitude;
  }
}
