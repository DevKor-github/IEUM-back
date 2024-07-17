import { Place } from 'src/entities/place.entity';

export class PlaceDetailResDto {
  id: number;

  name: string;

  address: string;

  latitude: number; //위도

  longitude: number; //경도

  googlePlaceId: string; //googlePlaceId 필요

  openHours: string[];

  phoneNumber: string;

  primaryCategory: string;

  categories: string[];

  tags: string[];

  images: string[];

  //인스타 게스트 컬렉션
  //장소 스케쥴
  //큐레이션-장소
  constructor(place: Place) {
    this.id = place.id;
    this.name = place.name;
    this.address = place.address;
    this.latitude = place.latitude;
    this.longitude = place.longitude;
    this.googlePlaceId = place.googlePlaceId;
    //this.phoneNumber = place.phoneNumber;
    this.primaryCategory = place.primaryCategory;
    this.tags = place.placeTags?.map((placeTag) => placeTag.tag.tagName);
  }

  static fromCreation(place: Place): PlaceDetailResDto {
    const placeDetailResDto = new PlaceDetailResDto(place);
    placeDetailResDto.tags = [];
    placeDetailResDto.images = [];

    return placeDetailResDto;
  }
}
