import { categoryMapper } from 'src/common/utils/category-mapper.util';
import { ApiProperty } from '@nestjs/swagger';
import { tagParser } from 'src/common/utils/tag-parser.util';
import { Place } from 'src/place/entities/place.entity';
import { addressSimplifier } from 'src/common/utils/address-simplifier.util';

export class PlacePreviewResDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  mappedCategory: string;

  @ApiProperty()
  simplifiedAddress: string;

  @ApiProperty()
  locationTags: string[];

  @ApiProperty()
  categoryTags: string[];

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  constructor(place: Place) {
    const { locationTags, categoryTags } = tagParser(place.placeTags);
    this.id = place.id;
    this.name = place.name;
    this.mappedCategory = categoryMapper(place.primaryCategory);
    this.simplifiedAddress = addressSimplifier(place.address);
    this.imageUrl =
      place.placeImages.length != 0 ? place.placeImages[0].url : null;
    this.locationTags = locationTags;
    this.categoryTags = categoryTags;
    this.latitude = place.latitude;
    this.longitude = place.longitude;
  }
}
