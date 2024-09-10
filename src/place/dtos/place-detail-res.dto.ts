import { ApiProperty } from '@nestjs/swagger';
import { addressSimplifier } from 'src/common/utils/address-simplifier.util';
import { categoryMapper } from 'src/common/utils/category-mapper.util';
import { tagParser } from 'src/common/utils/tag-parser.util';
import { Place } from 'src/place/entities/place.entity';
import { PlaceImage } from '../entities/place-image.entity';
import { RawLinkedColletion } from 'src/common/interfaces/raw-linked-collection.interface';
import { Collection } from 'src/collection/entities/collection.entity';
import { CollectionType } from 'src/common/enums/collection-type.enum';

export class PlaceImageRes {
  @ApiProperty()
  url: string;

  @ApiProperty()
  authorName: string;

  @ApiProperty()
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

  @ApiProperty({ type: String, isArray: true })
  customTags: string[];

  @ApiProperty()
  simplifiedAddress: string; //간략 주소

  @ApiProperty()
  primaryCategory: string;

  @ApiProperty({ type: String, isArray: true })
  openingHours: string[];

  @ApiProperty()
  phone: string;

  @ApiProperty()
  googleMapsUri: string;

  @ApiProperty()
  freeParkingLot: boolean;

  @ApiProperty()
  paidParkingLot: boolean;

  @ApiProperty()
  freeStreetParking: boolean;

  @ApiProperty()
  allowsDogs: boolean;

  @ApiProperty()
  goodForGroups: boolean;

  @ApiProperty()
  takeout: boolean;

  @ApiProperty()
  delivery: boolean;

  @ApiProperty()
  reservable: boolean;

  @ApiProperty()
  latitude: number; //위도

  @ApiProperty()
  longitude: number; //경도

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

    this.phone = place.phone;
    this.latitude = place.latitude;
    this.longitude = place.longitude;
    this.address = place.address;
    this.roadAddress = place.roadAddress;

    this.linkedCollections = linkedCollections.map(
      (linkedCollection) => new LinkedCollectionRes(linkedCollection),
    );
    this.placeImages = placeImages.map(
      (placeImage) => new PlaceImageRes(placeImage),
    );
  }
}
