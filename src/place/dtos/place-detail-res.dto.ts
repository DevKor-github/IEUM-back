import { ApiProperty } from '@nestjs/swagger';
import { addressSimplifier } from 'src/common/utils/address-simplifier.util';
import { categoryMapper } from 'src/common/utils/category-mapper.util';
import { tagParser } from 'src/common/utils/tag-parser.util';
import { Place } from 'src/place/entities/place.entity';
import { PlaceImage } from '../entities/place-image.entity';
import { RawLinkedColletion } from 'src/common/interfaces/raw-linked-collection.interface';
import { Collection } from 'src/collection/entities/collection.entity';
import { CollectionType } from 'src/common/enums/collection-type.enum';
import { IeumCategory } from 'src/common/enums/ieum-category.enum';

export class PlaceImageRes {
  @ApiProperty()
  url: string;

  @ApiProperty({ description: '이미지를 업로드한 사용자의 Google 닉네임' })
  authorName: string;

  @ApiProperty({
    description: '이미지를 업로드한 사용자의 Google Maps프로필 링크',
  })
  authorUri: string;

  constructor(placeImage: PlaceImage) {
    this.url = placeImage.url;
    this.authorName = placeImage.authorName;
    this.authorUri = placeImage.authorUri;
  }
}

export class LinkedCollectionRes {
  @ApiProperty()
  id: number;

  @ApiProperty()
  link: string;

  @ApiProperty({ enum: CollectionType })
  collectionType: CollectionType;

  @ApiProperty()
  content: string;

  @ApiProperty()
  isViewed: boolean;

  @ApiProperty()
  isSaved: boolean;

  @ApiProperty({ description: '조회 시간' })
  updatedAt: Date;

  constructor(linkedCollection: Collection) {
    this.id = linkedCollection.id;
    this.link = linkedCollection.link;
    this.collectionType = linkedCollection.collectionType;
    this.content = linkedCollection.content;
    this.isViewed = linkedCollection.isViewed;
    this.updatedAt = linkedCollection.updatedAt;
  }
}
export class PlaceDetailResDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  isSaved: boolean = false;

  @ApiProperty({
    type: String,
    isArray: true,
    description: '운영자가 해당 장소에 추가한 태그',
  })
  customTags: string[];

  @ApiProperty()
  simplifiedAddress: string; //간략 주소

  @ApiProperty({ description: '장소의 주요 카테고리' })
  primaryCategory: string;

  @ApiProperty({ type: String, isArray: true })
  openingHours?: string[];

  @ApiProperty()
  phone: string;

  @ApiProperty()
  googleMapsUri?: string;

  @ApiProperty({ description: '무료 주차장 유무' })
  freeParkingLot?: boolean;

  @ApiProperty({ description: '유료 주차장 유무' })
  paidParkingLot?: boolean;

  @ApiProperty({ description: '무료 길거리 주차 유무' })
  freeStreetParking?: boolean;

  @ApiProperty({ description: '반려견 동반 가능 여부' })
  allowsDogs?: boolean;

  @ApiProperty({ description: '단체석 유무' })
  goodForGroups?: boolean;

  @ApiProperty()
  takeout?: boolean;

  @ApiProperty()
  delivery?: boolean;

  @ApiProperty({ description: '예약 가능 여부' })
  reservable?: boolean;

  @ApiProperty()
  latitude: number; //위도

  @ApiProperty()
  longitude: number; //경도

  @ApiProperty()
  ieumCategory: string;

  @ApiProperty()
  address: string; //지번 주소

  @ApiProperty()
  roadAddress: string;

  @ApiProperty({ type: LinkedCollectionRes, isArray: true })
  linkedCollections: LinkedCollectionRes[];

  @ApiProperty({ type: PlaceImageRes, isArray: true })
  placeImages: PlaceImageRes[];

  constructor(
    place: Place,
    placeImages: PlaceImage[],
    linkedCollections: Collection[],
  ) {
    const { locationTags, categoryTags, customTags } = tagParser(
      place.placeTags,
    );

    this.id = place.id;
    this.name = place.name;
    this.customTags = customTags;
    this.simplifiedAddress = addressSimplifier(place.address);
    this.primaryCategory = place.primaryCategory;

    if (place.placeDetail) {
      this.openingHours = place.placeDetail.weekDaysOpeningHours;
      this.freeParkingLot = place.placeDetail.freeParkingLot;
      this.paidParkingLot = place.placeDetail.paidParkingLot;
      this.freeStreetParking = place.placeDetail.freeStreetParking;
      this.allowsDogs = place.placeDetail.allowsDogs;
      this.takeout = place.placeDetail.takeout;
      this.delivery = place.placeDetail.delivery;
      this.reservable = place.placeDetail.reservable;
      this.goodForGroups = place.placeDetail.goodForGroups;
      this.googleMapsUri = place.placeDetail.googleMapsUri;
    }

    this.phone = place.phone;
    this.latitude = place.latitude;
    this.longitude = place.longitude;
    this.ieumCategory = categoryMapper(this.primaryCategory);
    this.address = place.address;
    this.roadAddress = place.roadAddress;

    this.linkedCollections = linkedCollections.map((linkedCollection) => {
      if (
        linkedCollection.collectionPlaces.some(
          (collectionPlace) => collectionPlace.isSaved,
        )
      ) {
        this.isSaved = true;
      }
      return new LinkedCollectionRes(linkedCollection);
    });
    this.placeImages = placeImages.map(
      (placeImage) => new PlaceImageRes(placeImage),
    );
  }
}
