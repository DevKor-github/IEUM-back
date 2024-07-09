import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InstaGuestCollection } from './insta-guest-collection.entity';
import { PlaceSchedule } from './place-schedule.entity';
import { CurationPlace } from './curation-place.entity';
import { PlaceCategory } from './place-category.entity';
import { PlaceTag } from './place-tag.entity';
import { PlaceImage } from './place-image.entity';
import { OpenHours } from './open-hours.entity';
import { AddressComponents } from './address-components.entity';
import { FolderPlace } from './folder-place.entity';
import { InstaGuestFolder } from './insta-guest-folder.entity';
import { InstaGuestCollectionPlace } from './insta-guest-collection-place.entity';
import { PlaceDetail } from './place-detail.entity';

@Entity()
export class Place {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  depth2Address: string;

  @Column('decimal', { nullable: true })
  latitude: number; //위도

  @Column('decimal', { nullable: true })
  longitude: number; //경도

  @Column({ nullable: true })
  googlePlaceId: string; //googlePlaceId 필요

  @Column({ nullable: true })
  primaryCategory: string; //주요 카테고리

  //인스타 게스트 컬렉션
  @OneToMany(
    () => InstaGuestCollectionPlace,
    (instaGuestCollectionPlace) => instaGuestCollectionPlace.place,
  )
  instaGuestCollectionPlaces: InstaGuestCollectionPlace[];

  //장소 스케쥴
  @OneToMany(() => PlaceSchedule, (placeSchedule) => placeSchedule.place)
  placeSchedules: PlaceSchedule[];

  //큐레이션-장소
  @OneToMany(() => CurationPlace, (curationPlace) => curationPlace.place)
  curationPlaces: CurationPlace[];

  //장소-카테고리
  @OneToMany(() => PlaceCategory, (placeCategory) => placeCategory.place)
  placeCategories: PlaceCategory[];

  //장소-태그
  @OneToMany(() => PlaceTag, (placeTag) => placeTag.place)
  placeTags: PlaceTag[];

  //장소-영업시간
  @OneToOne(() => OpenHours, (openHours) => openHours.place)
  openHours: OpenHours;

  //장소-주소 요소
  @OneToOne(
    () => AddressComponents,
    (addressComponents) => addressComponents.place,
  )
  addressComponents: AddressComponents;

  //장소-이미지
  @OneToMany(() => PlaceImage, (placeImage) => placeImage.place)
  placeImages: PlaceImage[];

  //폴더-장소
  @OneToMany(() => FolderPlace, (folderPlace) => folderPlace.place)
  folderPlaces: FolderPlace[];

  @OneToMany(
    () => InstaGuestFolder,
    (instaGuestFolder) => instaGuestFolder.instaGuestFolderPlaces,
  )
  instaGuestFolderPlaces: InstaGuestFolder[];

  @OneToOne(() => PlaceDetail, (placeDetail) => placeDetail.place)
  placeDetail: PlaceDetail;
}
