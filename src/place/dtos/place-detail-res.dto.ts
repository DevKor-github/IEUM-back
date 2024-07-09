import { Category } from 'src/entities/category.entity';
import { OpenHours } from 'src/entities/open-hours.entity';
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
    this.openHours = place.openHours?.opening;
    //this.phoneNumber = place.phoneNumber;
    this.primaryCategory = place.primaryCategory;
    this.categories = place.placeCategories?.map(
      (placeCategory) => placeCategory.category.categoryName,
    );
    this.tags = place.placeTags?.map((placeTag) => placeTag.tag.tagName);
    this.images = place.placeImages?.map((placeImage) => placeImage.image.url);
  }

  static fromCreation(
    place: Place,
    openHours?: OpenHours,
    categories?: Category[],
  ): PlaceDetailResDto {
    const placeDetailResDto = new PlaceDetailResDto(place);
    placeDetailResDto.openHours = openHours?.opening || [];
    placeDetailResDto.categories = categories
      ? categories.map((category) => category.categoryName)
      : [];
    placeDetailResDto.tags = [];
    placeDetailResDto.images = [];

    return placeDetailResDto;
  }
}
